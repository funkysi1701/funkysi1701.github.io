# funkysi1701.com - My Blog (using Hugo)

Repo for my website [www.funkysi1701.com](https://www.funkysi1701.com?utm_source=gh) actually hosted on Azure Static Websites not github pages.

## Getting Started

To run locally use
hugo server -D

To run locally using docker use
docker run --rm -it -v .:/src -p 1313:1313 floryn90/hugo:0.146.3 server -D --disableFastRender 

To run on github codespace run
hugo server -D --baseUrl="https://funkysi1701-funkysi1701-github-io-x5wvxvxfv9q4-1313.githubpreview.dev" --appendPort=false

Test site can be found https://funkysi1701.github.io/

### Prerequisites

Need to install Hugo first see [Hugo](https://gohugo.io/) for help

## Running the tests

What tests? I usually browse the test site and make sure everything looks good

## Deployment

* PR into develop deploys to https://funkysi1701.github.io/ using github actions, use feature branches if you can
* PR from develop to master deploys to [www.funkysi1701.com](https://www.funkysi1701.com?utm_source=gh) using github actions

## Built With

* [Hugo](https://gohugo.io/) - The web framework used

## Contributing

??

## Authors

* **Simon Foster** - *Initial work* - [funkysi1701](https://github.com/funkysi1701)

See also the list of [contributors](https://github.com/funkysi1701/funkysi1701.github.io/contributors) who participated in this project.

## Acknowledgments

Other Bloggers etc

---

[![Azure Static Web Apps CI/CD](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml/badge.svg)](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml)

[![pages-build-deployment](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/pages/pages-build-deployment)

