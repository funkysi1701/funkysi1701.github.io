#!/usr/bin/env node
/**
 * Validate staticwebapp.config.json against the SchemaStore schema and site
 * security / routing best practices. Used locally and by GitHub Actions.
 *
 * Schema: scripts/schemas/staticwebapp.config.schema.json
 * (from https://json.schemastore.org/staticwebapp.config.json)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const CONFIG_PATH = join(ROOT, 'staticwebapp.config.json');
const SCHEMA_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  'schemas',
  'staticwebapp.config.schema.json',
);

/** Security headers this site must keep on every SWA deploy. */
const REQUIRED_HEADERS = {
  'Strict-Transport-Security': {
    test: (v) => {
      const m = /max-age=(\d+)/i.exec(v);
      if (!m) return 'must include max-age=<seconds>';
      if (Number(m[1]) < 31536000) return 'max-age must be at least 31536000 (1 year)';
      if (!/includeSubDomains/i.test(v)) return 'should include includeSubDomains';
      return null;
    },
  },
  'X-Frame-Options': {
    test: (v) => (/^(SAMEORIGIN|DENY)$/i.test(v.trim()) ? null : 'must be SAMEORIGIN or DENY'),
  },
  'X-Content-Type-Options': {
    test: (v) => (v.trim().toLowerCase() === 'nosniff' ? null : 'must be nosniff'),
  },
  'Referrer-Policy': {
    test: (v) => (v.trim().length > 0 ? null : 'must be non-empty'),
  },
  'Permissions-Policy': {
    test: (v) => (v.trim().length > 0 ? null : 'must be non-empty'),
  },
  'Content-Security-Policy': {
    test: (v) => {
      const value = v.trim();
      if (!value) return 'must be non-empty';
      if (!/default-src\s+'self'/i.test(value)) return "must include default-src 'self'";
      if (!/script-src\b/i.test(value)) return 'must include script-src';
      if (!/object-src\s+'none'/i.test(value)) return "must include object-src 'none'";
      if (!/frame-ancestors\b/i.test(value)) return 'must include frame-ancestors';
      return null;
    },
  },
};

const errors = [];

function fail(path, message) {
  errors.push(path ? `${path}: ${message}` : message);
}

function childPath(path, key) {
  if (!path) return String(key);
  return Array.isArray(key) || /^\d+$/.test(String(key)) ? `${path}[${key}]` : `${path}.${key}`;
}

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function resolveRef(schema, root) {
  if (!schema || typeof schema !== 'object' || !schema.$ref) return schema;
  const ref = schema.$ref;
  if (!ref.startsWith('#/')) {
    fail('', `unsupported $ref ${ref}`);
    return {};
  }
  let cur = root;
  for (const part of ref.slice(2).split('/')) {
    cur = cur?.[part];
  }
  if (cur === undefined) {
    fail('', `unresolved $ref ${ref}`);
    return {};
  }
  return cur;
}

function validateAgainstSchema(value, schema, path, rootSchema) {
  schema = resolveRef(schema, rootSchema);
  if (!schema || typeof schema !== 'object') return;

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const ok = types.some((t) => {
      if (t === 'object') return isObject(value);
      if (t === 'array') return Array.isArray(value);
      if (t === 'string') return typeof value === 'string';
      if (t === 'integer') return Number.isInteger(value);
      if (t === 'number') return typeof value === 'number' && !Number.isNaN(value);
      if (t === 'boolean') return typeof value === 'boolean';
      if (t === 'null') return value === null;
      return false;
    });
    if (!ok) {
      fail(path, `expected type ${types.join('|')}, got ${Array.isArray(value) ? 'array' : typeof value}`);
      return;
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    fail(path, `must be one of ${JSON.stringify(schema.enum)}`);
  }

  if (schema.anyOf) {
    const before = errors.length;
    let matched = false;
    for (const option of schema.anyOf) {
      const snap = errors.length;
      validateAgainstSchema(value, option, path, rootSchema);
      if (errors.length === snap) {
        matched = true;
        errors.length = before;
        break;
      }
      errors.length = snap;
    }
    if (!matched) {
      fail(path, 'does not match any allowed schema alternative');
    }
    return;
  }

  if (isObject(value) && schema.properties) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in value)) fail(childPath(path, key), 'required property missing');
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in schema.properties)) {
          fail(childPath(path, key), 'unknown property (not in SWA schema)');
        }
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (key in value) {
        validateAgainstSchema(value[key], childSchema, childPath(path, key), rootSchema);
      }
    }
  }

  if (Array.isArray(value) && schema.items) {
    value.forEach((item, i) => {
      validateAgainstSchema(item, schema.items, childPath(path, i), rootSchema);
    });
  }

  if (isObject(value) && schema.patternProperties && !schema.properties) {
    for (const [key, child] of Object.entries(value)) {
      let matched = false;
      for (const [pattern, childSchema] of Object.entries(schema.patternProperties)) {
        if (new RegExp(pattern).test(key)) {
          matched = true;
          validateAgainstSchema(child, childSchema, childPath(path, key), rootSchema);
          break;
        }
      }
      if (!matched && schema.additionalProperties === false) {
        fail(childPath(path, key), 'key does not match allowed patterns');
      }
    }
  }
}

function validateBestPractices(config) {
  // This is a multi-page Hugo site, not an SPA. A navigationFallback to /index.html
  // turns every missing URL (and missing asset) into a soft-404 homepage (HTTP 200).
  // Prefer responseOverrides["404"] → /404.html so Azure returns a real 404.
  if (config.navigationFallback !== undefined) {
    const fb = config.navigationFallback;
    const rewrite = isObject(fb) ? fb.rewrite : undefined;
    if (typeof rewrite === 'string' && /^\/index\.html\/?$/i.test(rewrite)) {
      fail(
        'navigationFallback.rewrite',
        'must not rewrite missing routes to /index.html (causes soft-404 homepage); remove navigationFallback and use responseOverrides.404 instead',
      );
    } else if (!isObject(fb) || typeof rewrite !== 'string' || !rewrite.startsWith('/')) {
      fail('navigationFallback.rewrite', 'if set, must be a site-relative path starting with /');
    }
  }

  const notFound = config.responseOverrides?.['404'];
  if (!isObject(notFound) || typeof notFound.rewrite !== 'string') {
    fail('responseOverrides.404.rewrite', 'required so missing pages serve /404.html');
  } else if (notFound.rewrite !== '/404.html') {
    fail('responseOverrides.404.rewrite', `expected "/404.html", got ${JSON.stringify(notFound.rewrite)}`);
  }
  if (isObject(notFound) && notFound.statusCode !== undefined && notFound.statusCode !== 404) {
    fail(
      'responseOverrides.404.statusCode',
      `must remain 404 (or be omitted); got ${JSON.stringify(notFound.statusCode)}`,
    );
  }

  if (!isObject(config.globalHeaders)) {
    fail('globalHeaders', 'required — security headers must be set for all responses');
    return;
  }

  for (const [name, rule] of Object.entries(REQUIRED_HEADERS)) {
    const value = config.globalHeaders[name];
    if (typeof value !== 'string') {
      fail(`globalHeaders.${name}`, 'required security header missing');
      continue;
    }
    const reason = rule.test(value);
    if (reason) fail(`globalHeaders.${name}`, reason);
  }

  if (Array.isArray(config.routes)) {
    for (const [i, route] of config.routes.entries()) {
      if (!isObject(route)) continue;
      if (route.redirect && route.rewrite) {
        fail(`routes[${i}]`, 'must not set both redirect and rewrite');
      }
      if (route.route === '/*' && Array.isArray(route.allowedRoles) && route.allowedRoles.length > 0) {
        const roles = route.allowedRoles.map((r) => String(r).toLowerCase());
        if (!roles.includes('anonymous') && !roles.includes('authenticated')) {
          fail(
            `routes[${i}]`,
            'locking /* to custom roles can block the whole site; allow anonymous or authenticated',
          );
        }
      }
    }
  }
}

function main() {
  let raw;
  try {
    raw = readFileSync(CONFIG_PATH, 'utf8');
  } catch (err) {
    console.error(`Cannot read ${CONFIG_PATH}: ${err.message}`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(raw);
  } catch (err) {
    console.error(`Invalid JSON in staticwebapp.config.json: ${err.message}`);
    process.exit(1);
  }

  let schema;
  try {
    schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
  } catch (err) {
    console.error(`Cannot read schema ${SCHEMA_PATH}: ${err.message}`);
    process.exit(1);
  }

  validateAgainstSchema(config, schema, '', schema);
  validateBestPractices(config);

  if (errors.length === 0) {
    console.log('OK: staticwebapp.config.json matches SchemaStore schema and site best practices.');
    process.exit(0);
  }

  console.error('staticwebapp.config.json validation failed:\n');
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  console.error(
    '\nSee https://aka.ms/swa/config-schema and scripts/schemas/staticwebapp.config.schema.json',
  );
  process.exit(1);
}

main();
