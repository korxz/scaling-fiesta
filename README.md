# Scaling Fiesta

Create a console program in your language of choice that:
● Traverses all pages on https://books.toscrape.com/
● Downloads and saves all files (pages, images...) to disk while keeping the file structure
● Shows some kind of progress information in the console

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you need to have the following installed on your local machine:

- Docker 20.10.21

OR

- Yarn 1.22.17
- NodeJs v18.12.1

### Installing

Follow these steps to set up the project:

1. Clone the repository:

   ```
   git clone https://github.com/korxz/scaling-fiesta.git
   ```

2. Run with docker

   ```
   docker build -t scaling-fiesta .
   ```

   ```
   docker run scaling-fiesta
   ```

3. Run with NodeJs (ts-node)

   ```
   yarn install
   ```

   ```
   yarn scrape
   ```

### Testing

To run tests you can use yarn command `yarn test`

### Outputs

#### Pages

Scraped pages are being saved in `src/pages` where filename friendly url is the name of the file.
Scraped images are being saved in `src/images` where image path is the name of the file.
