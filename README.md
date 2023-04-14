# About

This script is a program that can create shorter links for long URLs, and can redirect users to the original long URL when they click on the short link. The program uses a special code called nanoid to generate unique short codes for each long URL. These short codes are stored in a special database called a Workers KV store.

When a user clicks on a short link, the program will look up the original long URL in the database and redirect the user to that URL.

The program also has some security features to make sure that only authorized users can generate short links. When a user tries to generate a short link, they need to enter a password. If they enter the wrong password, the program will not generate a short link.

Overall, this program helps make long URLs shorter and easier to share, while also keeping them secure and making sure that only authorized users can create short links.

# Commands

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `yarn dev`          | starts the development server |
| `yarn publish:prod` | deploy the build on prod      |
| `yarn format`       | format the code using petter  |
