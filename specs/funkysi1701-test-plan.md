# Funkysi1701.com Comprehensive Test Plan

## Application Overview

Funkysi1701.com is a personal technical blog and portfolio website for Simon Foster (Funky Si), a full-stack developer specializing in .NET, Azure, and DevOps. Built with Hugo static site generator and deployed to Azure Static Web Apps, the site features blog posts dating back to 2014, organized by year and categorized by tags. Key features include a navigation menu, search functionality, newsletter subscription, social media integration, project showcase, and a Giscus-based commenting system. The site is responsive and includes security headers for enhanced protection.

## Test Scenarios

### 1. Homepage and Navigation

**Seed:** `seed.spec.ts`

#### 1.1. Homepage loads successfully

**File:** `tests/homepage-navigation/homepage-loads.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Verify the page loads without errors
  3. Check that the page title contains 'Simon Foster' or 'Funky Si'
  4. Verify the main navigation menu is visible
  5. Confirm blog posts are displayed on the homepage

**Expected Results:**
  - Homepage loads within 3 seconds
  - No console errors appear
  - Page title is descriptive and includes author name
  - Navigation menu displays all expected items
  - At least 5-10 recent blog posts are visible

#### 1.2. Main navigation menu functionality

**File:** `tests/homepage-navigation/main-navigation.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Verify all navigation items are visible: About, Projects, Tools & Resources, Newsletter, Contact, Events, Search, Support this site
  3. Click on each navigation link one at a time
  4. Verify each page loads correctly
  5. Check that the navigation menu remains visible on all pages

**Expected Results:**
  - All 8 navigation menu items are displayed
  - Each link is clickable and navigates to the correct page
  - Pages load without errors
  - Navigation menu is consistent across all pages
  - Support link opens in a new tab to external URL

#### 1.3. Responsive design on mobile viewport

**File:** `tests/homepage-navigation/responsive-mobile.spec.ts`

**Steps:**
  1. Set viewport to mobile size (375x667)
  2. Navigate to https://www.funkysi1701.com
  3. Check if navigation menu collapses to hamburger menu
  4. Click hamburger menu to expand
  5. Verify all navigation items are accessible
  6. Test navigation on About, Projects, and Contact pages
  7. Verify content is readable and not cut off

**Expected Results:**
  - Navigation adapts to mobile viewport
  - Hamburger menu icon appears
  - Menu expands showing all navigation items
  - All links remain functional
  - Content is properly formatted for mobile
  - No horizontal scrolling required
  - Text is readable without zooming

#### 1.4. Responsive design on tablet viewport

**File:** `tests/homepage-navigation/responsive-tablet.spec.ts`

**Steps:**
  1. Set viewport to tablet size (768x1024)
  2. Navigate to https://www.funkysi1701.com
  3. Verify layout adapts appropriately
  4. Check navigation menu display
  5. Test blog post grid/list layout
  6. Verify images scale properly

**Expected Results:**
  - Layout adapts to tablet viewport
  - Navigation is accessible
  - Content is properly formatted
  - Images are appropriately sized
  - No layout breaking or overflow issues

### 2. About and Static Pages

**Seed:** `seed.spec.ts`

#### 2.1. About page content and links

**File:** `tests/about-static-pages/about-page.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/about/
  2. Verify page loads successfully
  3. Check for profile image display
  4. Verify author bio is present
  5. Check that certification badges are displayed
  6. Click on Azure Fundamentals certification badge link
  7. Verify link opens to Credly in new tab
  8. Go back and click on AWS Cloud Practitioner badge link
  9. Verify link opens to Credly in new tab

**Expected Results:**
  - About page loads without errors
  - Profile image is visible and loads correctly
  - Bio text describes Simon Foster's background and expertise
  - Two certification badges are displayed (Azure and AWS)
  - Certification links are functional
  - Links open in new tabs to credly.com
  - Page describes specializations: .NET, Azure, DevOps

#### 2.2. Contact page functionality

**File:** `tests/about-static-pages/contact-page.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/contact/
  2. Verify email address is displayed as mailto link
  3. Check for social media links
  4. Verify presence of GitHub, Twitter/X, BlueSky, Mastodon, LinkedIn, Facebook links
  5. Click on GitHub link
  6. Verify it opens to github.com/funkysi1701
  7. Test LinkedIn link opens to correct profile
  8. Verify all social media links are functional

**Expected Results:**
  - Contact page loads successfully
  - Email link is displayed and clickable (funkysi1701@gmail.com)
  - At least 6 social media platforms are linked
  - All social media links are functional
  - Links open in new tabs
  - Links point to correct social media profiles

#### 2.3. Projects page displays portfolio

**File:** `tests/about-static-pages/projects-page.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/projects/
  2. Verify page loads successfully
  3. Check for Blog Platform project description
  4. Verify Episode Atlas project is listed
  5. Check for Mandelbrot Generator project
  6. Click on Episode Atlas external link
  7. Verify it opens episodeatlas.com in new tab
  8. Check for GitHub repository links
  9. Verify tech stack information is present for each project

**Expected Results:**
  - Projects page loads without errors
  - At least 3 projects are displayed
  - Each project includes description and tech stack
  - External links to live projects are functional
  - GitHub repository links work correctly
  - Project features are listed clearly

#### 2.4. Newsletter page content

**File:** `tests/about-static-pages/newsletter-page.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/newsletter/
  2. Verify page loads successfully
  3. Check for newsletter description
  4. Look for subscription form or link
  5. Verify recent topics are mentioned
  6. Check for target audience description
  7. Verify value proposition is clear

**Expected Results:**
  - Newsletter page loads without errors
  - Description explains newsletter content and frequency
  - Subscription mechanism is available
  - Recent topics give preview of content
  - Target audience is clearly defined
  - Value proposition differentiates the newsletter

#### 2.5. Tools and Resources page

**File:** `tests/about-static-pages/tools-resources-page.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/tools-and-resources/
  2. Verify page loads successfully
  3. Check for organized sections or categories
  4. Verify links are present
  5. Test a few random links to ensure they work
  6. Check for descriptions of tools/resources

**Expected Results:**
  - Tools & Resources page loads without errors
  - Content is organized in logical sections
  - Links to external resources are functional
  - Descriptions help users understand each resource
  - No broken links are present

#### 2.6. Privacy Policy and Terms pages

**File:** `tests/about-static-pages/legal-pages.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/privacy-policy/
  2. Verify page loads and contains privacy policy content
  3. Navigate to https://www.funkysi1701.com/terms/
  4. Verify page loads and contains terms content
  5. Check that both pages have professional formatting
  6. Verify no Lorem Ipsum placeholder text exists

**Expected Results:**
  - Privacy Policy page loads successfully
  - Privacy policy contains actual legal content
  - Terms page loads successfully
  - Terms contain actual legal content
  - Both pages are professionally formatted
  - Content is complete and not placeholder text

### 3. Blog Posts and Content

**Seed:** `seed.spec.ts`

#### 3.1. Individual blog post displays correctly

**File:** `tests/blog-posts-content/single-blog-post.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/posts/2026/ndc-london-2026
  2. Verify blog post loads successfully
  3. Check that post title is displayed
  4. Verify post date is shown
  5. Check for cover image display
  6. Verify blog content is readable and formatted
  7. Check for tags at bottom or top of post
  8. Verify author information is displayed
  9. Check for reading time estimate

**Expected Results:**
  - Blog post loads without errors
  - Post title 'NDC London 2026' is prominently displayed
  - Publication date '2026-01-31' is visible
  - Cover image loads correctly
  - Content is well-formatted with headings and paragraphs
  - Tags are displayed and clickable
  - Author 'funkysi1701' is shown
  - Reading time estimate is displayed

#### 3.2. Blog post comments integration

**File:** `tests/blog-posts-content/blog-comments.spec.ts`

**Steps:**
  1. Navigate to a blog post (e.g., https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026)
  2. Scroll to the bottom of the post
  3. Check for Giscus comment section
  4. Verify comment section loads
  5. Check if GitHub sign-in option is available
  6. Verify existing comments display (if any)

**Expected Results:**
  - Comment section is present at bottom of post
  - Giscus widget loads successfully
  - GitHub authentication option is available
  - Comment interface is functional
  - No console errors from Giscus integration

#### 3.3. Blog posts by year navigation

**File:** `tests/blog-posts-content/posts-by-year.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/2026/
  2. Verify page shows posts from 2026
  3. Check that posts are listed chronologically
  4. Navigate to https://www.funkysi1701.com/2025/
  5. Verify posts from 2025 are displayed
  6. Navigate to https://www.funkysi1701.com/2024/
  7. Verify posts from 2024 are displayed
  8. Test navigation for older years (2023, 2022, etc.)

**Expected Results:**
  - Year archive pages load successfully
  - Only posts from specified year are shown
  - Posts are ordered by date (newest first)
  - Archive pages for all years (2014-2026) are accessible
  - Post previews include title, date, excerpt
  - Clicking post preview navigates to full post

#### 3.4. Blog tag filtering

**File:** `tests/blog-posts-content/tag-filtering.spec.ts`

**Steps:**
  1. Navigate to a blog post with tags
  2. Click on a tag (e.g., 'NDC London' or 'Azure')
  3. Verify tag page loads showing all posts with that tag
  4. Check that posts are relevant to the tag
  5. Navigate to https://www.funkysi1701.com/tags/
  6. Verify tag cloud or list is displayed
  7. Click on another tag from the list
  8. Verify filtering works correctly

**Expected Results:**
  - Tag pages load successfully
  - Only posts with selected tag are displayed
  - Tags page shows all available tags
  - Tag counts are displayed (if implemented)
  - Tagged posts are relevant to the tag
  - Navigation between tags works smoothly

#### 3.5. Blog category filtering

**File:** `tests/blog-posts-content/category-filtering.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/categories/
  2. Verify categories page loads
  3. Click on 'tech' category
  4. Verify posts in tech category are displayed
  5. Check that posts are relevant to category
  6. Test navigation back to all categories
  7. Test other categories if available

**Expected Results:**
  - Categories page loads successfully
  - Available categories are listed
  - Category filtering works correctly
  - Posts match the selected category
  - Category navigation is intuitive

#### 3.6. Blog post images and media

**File:** `tests/blog-posts-content/images-media.spec.ts`

**Steps:**
  1. Navigate to a blog post with images
  2. Verify cover image loads correctly
  3. Check inline images within post content
  4. Verify images have proper alt text
  5. Test image loading performance
  6. Check for lazy loading implementation
  7. Verify images are responsive and scale properly

**Expected Results:**
  - All images load successfully
  - Cover images are properly sized
  - Inline images are embedded correctly
  - Alt text is present for accessibility
  - Images don't break page layout
  - Images are optimized for web
  - Responsive images work on mobile/tablet

#### 3.7. Events page functionality

**File:** `tests/blog-posts-content/events-page.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/posts/events/
  2. Verify Events page loads successfully
  3. Check for list of events
  4. Verify event details are displayed (date, title, description)
  5. Test any links to event details or external sites
  6. Check chronological ordering of events

**Expected Results:**
  - Events page loads without errors
  - Events are listed with relevant details
  - Event information includes dates and descriptions
  - Links to events or event posts work correctly
  - Events are organized logically (by date)

### 4. Search Functionality

**Seed:** `seed.spec.ts`

#### 4.1. Search page loads and basic search

**File:** `tests/search-functionality/basic-search.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/search/
  2. Verify search page loads
  3. Check for search input field
  4. Enter a common term like 'Azure' in search box
  5. Press Enter or click search button
  6. Verify search results appear
  7. Check that results are relevant to search term
  8. Verify result count is displayed

**Expected Results:**
  - Search page loads successfully
  - Search input is visible and functional
  - Search executes when Enter is pressed
  - Results display relevant blog posts
  - Result snippets show matching content
  - Results include post titles and excerpts
  - Number of results is shown

#### 4.2. Search with no results

**File:** `tests/search-functionality/no-results.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/search/
  2. Enter a random string unlikely to appear (e.g., 'xyzabc123notfound')
  3. Execute search
  4. Verify 'no results' message appears
  5. Check that message is user-friendly
  6. Verify search box remains functional for new search

**Expected Results:**
  - Search executes without errors
  - Clear 'no results found' message is displayed
  - Message suggests trying different keywords
  - Search box is ready for new query
  - Page doesn't show error or break

#### 4.3. Search with special characters

**File:** `tests/search-functionality/special-chars-search.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/search/
  2. Enter search term with special characters (e.g., 'C#' or '.NET')
  3. Execute search
  4. Verify results are returned
  5. Check that special characters are handled correctly
  6. Test search with symbols like '@', '#', '&'

**Expected Results:**
  - Search handles special characters gracefully
  - Relevant results are returned for terms like 'C#' and '.NET'
  - No JavaScript errors appear
  - Search doesn't break with special characters
  - Results match the intended search query

#### 4.4. Search result navigation

**File:** `tests/search-functionality/result-navigation.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/search/
  2. Search for 'DevOps'
  3. Verify search results appear
  4. Click on first search result
  5. Verify it navigates to the correct blog post
  6. Use browser back button
  7. Verify search results are preserved
  8. Click on a different result
  9. Verify navigation works correctly

**Expected Results:**
  - Search results are clickable
  - Clicking result navigates to correct post
  - Browser back button returns to search results
  - Search query and results persist after navigation
  - Multiple result clicks work as expected

#### 4.5. Search pagination (if applicable)

**File:** `tests/search-functionality/search-pagination.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/search/
  2. Search for a broad term that returns many results (e.g., 'Azure')
  3. Check if pagination controls appear
  4. If pagination exists, click to next page
  5. Verify new results load
  6. Test navigation back to previous page
  7. Check page numbers or indicators

**Expected Results:**
  - If more than 10-20 results, pagination appears
  - Pagination controls are functional
  - Different results appear on each page
  - Page navigation is smooth
  - Current page is clearly indicated

### 5. Performance and Technical

**Seed:** `seed.spec.ts`

#### 5.1. Page load performance

**File:** `tests/performance-technical/page-load-speed.spec.ts`

**Steps:**
  1. Clear browser cache
  2. Navigate to https://www.funkysi1701.com
  3. Measure time to first contentful paint
  4. Measure time to interactive
  5. Check total page load time
  6. Verify page loads in under 3 seconds on good connection
  7. Test with throttled network (3G simulation)
  8. Verify page is still usable on slow connections

**Expected Results:**
  - Homepage loads in under 3 seconds (fast connection)
  - First contentful paint occurs within 1.5 seconds
  - Page is interactive within 2.5 seconds
  - Static assets load efficiently
  - Page remains usable on 3G connection
  - No render-blocking resources delay initial paint

#### 5.2. Security headers validation

**File:** `tests/performance-technical/security-headers.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Open browser developer tools
  3. Check Network tab for response headers
  4. Verify presence of Strict-Transport-Security header
  5. Check for X-Frame-Options header
  6. Verify X-Content-Type-Options header
  7. Check for Referrer-Policy header
  8. Verify Content-Security-Policy if applicable

**Expected Results:**
  - Strict-Transport-Security header is present
  - X-Frame-Options is set to SAMEORIGIN or DENY
  - X-Content-Type-Options is set to nosniff
  - Referrer-Policy header is configured
  - Security headers match staticwebapp.config.json settings
  - No sensitive information in headers

#### 5.3. RSS feed validation

**File:** `tests/performance-technical/rss-feed.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/index.xml
  2. Verify RSS feed loads
  3. Check that XML is well-formed
  4. Verify feed includes recent blog posts
  5. Check for proper encoding of special characters
  6. Verify feed items include title, link, description, pubDate
  7. Test feed in an RSS reader (if possible)

**Expected Results:**
  - RSS feed is accessible at /index.xml
  - XML is valid and well-formed
  - Feed contains recent blog posts (at least 10-20)
  - All required RSS elements are present
  - Special characters are properly encoded
  - Links in feed point to correct blog posts
  - Feed can be parsed by standard RSS readers

#### 5.4. JSON search index

**File:** `tests/performance-technical/json-index.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/index.json
  2. Verify JSON file loads
  3. Check that JSON is valid
  4. Verify structure includes blog posts with titles, URLs, content
  5. Check for proper encoding
  6. Verify all recent posts are included

**Expected Results:**
  - JSON index is accessible at /index.json
  - JSON is valid and parseable
  - Index includes comprehensive blog post data
  - Posts include title, permalink, content/summary
  - JSON structure supports search functionality
  - File size is reasonable (not excessively large)

#### 5.5. 404 error page handling

**File:** `tests/performance-technical/404-error.spec.ts`

**Steps:**
  1. Navigate to a non-existent page (e.g., https://www.funkysi1701.com/this-page-does-not-exist)
  2. Verify custom 404 page is displayed
  3. Check that 404 page has navigation menu
  4. Verify 404 page has helpful message
  5. Test link back to homepage
  6. Verify HTTP status code is 404

**Expected Results:**
  - Custom 404 page is displayed
  - 404 page maintains site design and branding
  - Navigation menu is present and functional
  - Error message is user-friendly
  - Links to homepage or other pages work
  - HTTP response code is 404 (not 200)

#### 5.6. robots.txt validation

**File:** `tests/performance-technical/robots-txt.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/robots.txt
  2. Verify robots.txt file loads
  3. Check that file is properly formatted
  4. Verify sitemap location is specified
  5. Check for any disallow rules
  6. Verify allow rules if any

**Expected Results:**
  - robots.txt is accessible
  - File is properly formatted
  - Sitemap URL is specified
  - Crawl rules are appropriate
  - No important content is blocked from indexing

#### 5.7. Sitemap validation

**File:** `tests/performance-technical/sitemap.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/sitemap.xml
  2. Verify sitemap loads successfully
  3. Check that XML is well-formed
  4. Verify sitemap includes all major pages
  5. Check for blog posts in sitemap
  6. Verify URLs are absolute (not relative)
  7. Check lastmod dates are present
  8. Verify priority values if used

**Expected Results:**
  - Sitemap is accessible at /sitemap.xml
  - XML is valid
  - Sitemap includes homepage, static pages, blog posts
  - All URLs are absolute and correct
  - Modification dates are present and accurate
  - Sitemap follows XML sitemap protocol
  - No broken URLs in sitemap

### 6. Social Media and External Links

**Seed:** `seed.spec.ts`

#### 6.1. Social media footer links

**File:** `tests/social-external-links/footer-social-links.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Scroll to footer
  3. Check for social media icons/links
  4. Verify presence of GitHub, Twitter, LinkedIn, Mastodon, BlueSky, Facebook
  5. Click on GitHub link
  6. Verify it opens github.com/funkysi1701 in new tab
  7. Test other social media links
  8. Verify all links open in new tabs

**Expected Results:**
  - Footer contains social media links
  - At least 6 social platforms are linked
  - All links are functional
  - Links open in new tabs (target='_blank')
  - Links point to correct social profiles
  - Social icons are visible and recognizable

#### 6.2. External project links

**File:** `tests/social-external-links/project-external-links.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com/projects/
  2. Find Episode Atlas project link
  3. Click on episodeatlas.com link
  4. Verify it opens in new tab
  5. Check GitHub repository links
  6. Verify GitHub links open to correct repositories
  7. Test all external links on projects page

**Expected Results:**
  - External project links are functional
  - Links open in new tabs
  - episodeatlas.com loads successfully
  - GitHub repository links point to correct repos
  - All external links work without errors

#### 6.3. Support this site link

**File:** `tests/social-external-links/support-link.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Click on 'Support this site' navigation link
  3. Verify it opens https://otieu.com/4/10431006 in new tab
  4. Check that link doesn't break site navigation
  5. Verify external site loads (or redirects appropriately)

**Expected Results:**
  - Support link is visible in main navigation
  - Link opens in new tab
  - External URL (otieu.com) loads or redirects
  - Original site tab remains open
  - No errors occur when clicking support link

#### 6.4. Blog post external links

**File:** `tests/social-external-links/blog-external-links.spec.ts`

**Steps:**
  1. Navigate to a blog post with external links
  2. Identify external links within post content
  3. Click on an external link
  4. Verify it opens in new tab
  5. Test multiple external links in different posts
  6. Verify no broken links exist

**Expected Results:**
  - External links in blog posts are functional
  - Links open in new tabs (when appropriate)
  - No 404 errors on external links
  - Links are properly formatted and clickable
  - Link text is descriptive

### 7. Accessibility

**Seed:** `seed.spec.ts`

#### 7.1. Keyboard navigation

**File:** `tests/accessibility/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Press Tab key repeatedly
  3. Verify focus moves through interactive elements in logical order
  4. Check that focused elements have visible focus indicators
  5. Navigate through main menu using Tab
  6. Press Enter on a menu item
  7. Verify page navigation works
  8. Test keyboard navigation on search page
  9. Verify Escape key closes any modals (if applicable)

**Expected Results:**
  - All interactive elements are keyboard accessible
  - Tab order is logical and intuitive
  - Focus indicators are clearly visible
  - Enter/Space keys activate links and buttons
  - No keyboard traps prevent navigation
  - Skip links are available (if implemented)
  - Modals are keyboard accessible

#### 7.2. Screen reader compatibility

**File:** `tests/accessibility/screen-reader.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Verify page has proper heading hierarchy (h1, h2, h3)
  3. Check that all images have alt attributes
  4. Verify links have descriptive text
  5. Check for proper ARIA labels on interactive elements
  6. Verify form fields have associated labels
  7. Check that page language is declared (lang attribute)

**Expected Results:**
  - Page has single h1 element
  - Heading hierarchy is logical (no skipped levels)
  - All images have meaningful alt text
  - Link text is descriptive (not just 'click here')
  - ARIA labels enhance accessibility where needed
  - Form elements are properly labeled
  - HTML lang attribute is set to 'en-gb'

#### 7.3. Color contrast and readability

**File:** `tests/accessibility/color-contrast.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Verify text has sufficient contrast against background
  3. Check link colors are distinguishable
  4. Test with browser color blindness simulation (if available)
  5. Verify UI doesn't rely solely on color to convey information
  6. Check that text is readable without custom styles

**Expected Results:**
  - Text meets WCAG AA contrast ratio (4.5:1 for normal text)
  - Links are distinguishable from regular text
  - Color scheme works for colorblind users
  - Information isn't conveyed by color alone
  - Text remains readable when CSS is disabled
  - Font sizes are appropriate and scalable

#### 7.4. Form accessibility (newsletter)

**File:** `tests/accessibility/form-accessibility.spec.ts`

**Steps:**
  1. Navigate to newsletter signup form
  2. Verify form fields have visible labels
  3. Check that labels are associated with inputs (for/id)
  4. Test keyboard navigation through form
  5. Verify error messages are accessible (if validation exists)
  6. Check for helpful placeholder text
  7. Test form submission with keyboard only

**Expected Results:**
  - All form fields have visible labels
  - Labels are properly associated with inputs
  - Form is fully navigable with keyboard
  - Error messages are announced to screen readers
  - Required fields are clearly marked
  - Form can be submitted using Enter key
  - Focus management works correctly

#### 7.5. ARIA landmarks and regions

**File:** `tests/accessibility/aria-landmarks.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Inspect page structure for semantic HTML
  3. Check for <header>, <nav>, <main>, <footer> elements
  4. Verify proper use of <article> for blog posts
  5. Check for <aside> for sidebars (if applicable)
  6. Verify ARIA landmarks are used appropriately
  7. Check that page structure is semantic and logical

**Expected Results:**
  - Page uses semantic HTML5 elements
  - Header contains site logo and navigation
  - Main content is wrapped in <main> element
  - Footer contains expected footer content
  - Blog posts use <article> elements
  - Page structure helps screen reader navigation
  - ARIA landmarks enhance structure where needed

### 8. Edge Cases and Error Handling

**Seed:** `seed.spec.ts`

#### 8.1. Browser back and forward navigation

**File:** `tests/edge-cases/browser-navigation.spec.ts`

**Steps:**
  1. Navigate to https://www.funkysi1701.com
  2. Click on About page
  3. Click on Projects page
  4. Click browser back button
  5. Verify About page loads correctly
  6. Click browser forward button
  7. Verify Projects page loads correctly
  8. Navigate to a blog post
  9. Use back button multiple times
  10. Verify navigation history works correctly

**Expected Results:**
  - Browser back button works consistently
  - Pages load correctly when navigating back
  - Forward button works as expected
  - Page state is preserved during navigation
  - No errors occur during back/forward navigation
  - URL updates correctly with each navigation

#### 8.2. Direct URL access to deep links

**File:** `tests/edge-cases/deep-link-access.spec.ts`

**Steps:**
  1. Directly navigate to a specific blog post URL (for example, https://www.funkysi1701.com/posts/2025/01/31/some-post – this is a placeholder; replace it with an actual existing post URL such as the NDC London 2026 post)
  2. Verify page loads without errors
  3. Directly navigate to a tag page (e.g., /tags/azure/)
  4. Verify tag page loads correctly
  5. Directly navigate to a year archive (e.g., /2024/)
  6. Verify archive page loads correctly
  7. Test various deep link patterns
  8. Verify all direct URL accesses work

**Expected Results:**
  - All deep links are accessible directly
  - Navigation menu loads on deep-linked pages
  - No broken routes exist
  - Page content loads fully from direct access
  - No redirect loops occur
  - Proper URL structure is maintained

#### 8.3. JavaScript disabled fallback

**File:** `tests/edge-cases/no-javascript.spec.ts`

**Steps:**
  1. Disable JavaScript in browser
  2. Navigate to https://www.funkysi1701.com
  3. Verify basic content is still visible
  4. Check that navigation links work
  5. Test blog post access
  6. Verify static content loads
  7. Check if graceful degradation exists

**Expected Results:**
  - Core content is accessible without JavaScript
  - Navigation links work with JavaScript disabled
  - Blog posts are readable
  - Static site structure remains functional
  - Basic Hugo static site features work
  - Graceful degradation is implemented where needed

#### 8.4. Long content scrolling

**File:** `tests/edge-cases/long-content-scroll.spec.ts`

**Steps:**
  1. Navigate to a long blog post
  2. Scroll to bottom of page
  3. Verify footer appears correctly
  4. Scroll back to top
  5. Verify navigation remains accessible
  6. Check for 'back to top' button (if implemented)
  7. Test scroll performance
  8. Verify lazy-loaded images load as scrolled

**Expected Results:**
  - Long content scrolls smoothly
  - Footer loads correctly at bottom
  - Navigation remains accessible while scrolling
  - No layout breaking occurs during scroll
  - Images lazy-load appropriately
  - Scroll performance is acceptable
  - Back to top functionality works (if present)

#### 8.5. Multiple browser tabs

**File:** `tests/edge-cases/multiple-tabs.spec.ts`

**Steps:**
  1. Open https://www.funkysi1701.com in first tab
  2. Open homepage in second tab
  3. Navigate to different pages in each tab
  4. Switch between tabs
  5. Verify content loads correctly in each tab
  6. Check for any state conflicts
  7. Open external links which create new tabs
  8. Verify all tabs function independently

**Expected Results:**
  - Multiple tabs work independently
  - No state conflicts between tabs
  - Each tab maintains its own navigation state
  - External links create new tabs as expected
  - Performance doesn't degrade with multiple tabs
  - No cross-tab JavaScript errors

#### 8.6. Page refresh preservation

**File:** `tests/edge-cases/page-refresh.spec.ts`

**Steps:**
  1. Navigate to a blog post
  2. Scroll halfway down the page
  3. Press F5 or browser refresh button
  4. Verify page reloads correctly
  5. Navigate to search page
  6. Perform a search
  7. Refresh the page
  8. Check if search state is preserved (or appropriately reset)

**Expected Results:**
  - Page refresh works without errors
  - Page reloads with same URL
  - Content loads correctly after refresh
  - No unexpected state changes occur
  - Forms reset appropriately on refresh
  - Page position may or may not be preserved (browser dependent)

#### 8.7. Concurrent user sessions

**File:** `tests/edge-cases/concurrent-sessions.spec.ts`

**Steps:**
  1. Open site in regular browser window
  2. Open site in incognito/private window
  3. Navigate to different pages in each window
  4. Verify both sessions work independently
  5. Test comment functionality in both (if logged in)
  6. Check for any session conflicts

**Expected Results:**
  - Regular and incognito sessions work independently
  - No session conflicts occur
  - Static content serves correctly to all sessions
  - Comment authentication is independent per session
  - No cross-session data leakage
