// spec: specs/plan.md
// seed: tests/accessibility/form-accessibility.spec.ts

import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('Forms must contain a submit button (WCAG2AA H32.2)', async ({ page }) => {
    let homepageFormsData!: any;
    let searchPageFormsData!: any;
    let formsWithoutSubmit!: any[];

    await test.step('Navigate to the homepage', async () => {
      // 1. Navigate to the homepage https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Find all forms on homepage and verify submit buttons', async () => {
      // 2. Find all `<form>` elements on the page
      // 3. For each form, verify it contains at least one submit button
      homepageFormsData = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const formsData = [];
        
        for (let i = 0; i < forms.length; i++) {
          const form = forms[i];
          const formInfo = {
            index: i,
            id: form.id || 'no-id',
            action: form.action || 'no-action',
            method: form.method || 'GET',
            hasSubmitButton: false,
            submitButtons: [],
            allInputs: [],
            location: 'homepage'
          };
          
          // Check for submit buttons - An `<input type="submit">` or `<input type="image">`
          const submitInputs = form.querySelectorAll('input[type="submit"], input[type="image"]');
          // A <button> is a submit button unless type is explicitly "button" or "reset";
          // missing or invalid type values default to "submit" per the HTML spec.
          const allButtons = form.querySelectorAll('button');
          
          if (submitInputs.length > 0) {
            formInfo.hasSubmitButton = true;
            submitInputs.forEach(input => {
              formInfo.submitButtons.push(`input[type="${input.type}"]`);
            });
          }
          
          allButtons.forEach(button => {
            const typeAttr = button.getAttribute('type');
            const normalizedType = typeAttr ? typeAttr.toLowerCase() : null;
            const isSubmit = !normalizedType || (normalizedType !== 'button' && normalizedType !== 'reset');
            if (isSubmit) {
              formInfo.hasSubmitButton = true;
              formInfo.submitButtons.push(`button[type="${typeAttr || 'default'}"]`);
            }
          });
          
          // Get all inputs for context
          const inputs = form.querySelectorAll('input, button, select, textarea');
          inputs.forEach(input => {
            formInfo.allInputs.push(`${input.tagName.toLowerCase()}[type="${input.type || input.tagName.toLowerCase()}"]`);
          });
          
          formsData.push(formInfo);
        }
        
        return formsData;
      });

      console.log('Homepage forms analyzed:', homepageFormsData.length);
      homepageFormsData.forEach(form => {
        console.log(`Form ${form.index} (${form.id}): hasSubmitButton=${form.hasSubmitButton}, inputs=[${form.allInputs.join(', ')}]`);
      });
    });

    await test.step('Navigate to search page', async () => {
      // Also check the search page: Navigate to https://www.funkysi1701.com/search/
      await page.goto('/search/');
    });

    await test.step('Find search form and verify submit button', async () => {
      // Find the search form and verify the search form has a submit button
      searchPageFormsData = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const formsData = [];
        
        for (let i = 0; i < forms.length; i++) {
          const form = forms[i];
          const formInfo = {
            index: i,
            id: form.id || 'no-id',
            action: form.action || 'no-action',
            method: form.method || 'GET',
            hasSubmitButton: false,
            submitButtons: [],
            allInputs: [],
            location: 'search page'
          };
          
          // Check for submit buttons
          const submitInputs = form.querySelectorAll('input[type="submit"], input[type="image"]');
          // A <button> is a submit button unless type is explicitly "button" or "reset";
          // missing or invalid type values default to "submit" per the HTML spec.
          const allButtons = form.querySelectorAll('button');
          
          if (submitInputs.length > 0) {
            formInfo.hasSubmitButton = true;
            submitInputs.forEach(input => {
              formInfo.submitButtons.push(`input[type="${input.type}"]`);
            });
          }
          
          allButtons.forEach(button => {
            const typeAttr = button.getAttribute('type');
            const normalizedType = typeAttr ? typeAttr.toLowerCase() : null;
            const isSubmit = !normalizedType || (normalizedType !== 'button' && normalizedType !== 'reset');
            if (isSubmit) {
              formInfo.hasSubmitButton = true;
              formInfo.submitButtons.push(`button[type="${typeAttr || 'default'}"]`);
            }
          });
          
          // Get all inputs for context
          const inputs = form.querySelectorAll('input, button, select, textarea');
          inputs.forEach(input => {
            formInfo.allInputs.push(`${input.tagName.toLowerCase()}[type="${input.type || input.tagName.toLowerCase()}"]`);
          });
          
          formsData.push(formInfo);
        }
        
        return formsData;
      });

      console.log('Search page forms analyzed:', searchPageFormsData.length);
      searchPageFormsData.forEach(form => {
        console.log(`Form ${form.index} (${form.id}): hasSubmitButton=${form.hasSubmitButton}, inputs=[${form.allInputs.join(', ')}]`);
      });
    });

    await test.step('Validate all forms have submit buttons', async () => {
      // 4. Log a warning for any form that lacks a submit button, then fail the test
      const allForms = [...homepageFormsData, ...searchPageFormsData];
      formsWithoutSubmit = allForms.filter(form => !form.hasSubmitButton);

      // Log warnings for forms without submit buttons
      formsWithoutSubmit.forEach(form => {
        console.warn(`WCAG2AA H32.2 Violation: Form without submit button found on ${form.location}`);
        console.warn(`  - Form index: ${form.index}`);
        console.warn(`  - Form id: ${form.id}`);
        console.warn(`  - Form action: ${form.action}`);
        console.warn(`  - Form inputs: [${form.allInputs.join(', ')}]`);
        console.warn(`  - Submit buttons found: [${form.submitButtons.join(', ')}]`);
      });

      // Fail if any forms lack submit buttons
      expect(formsWithoutSubmit).toHaveLength(0);
    });
  });
});