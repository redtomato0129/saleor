# FAQ

## I get "Unauthorized" error message in Saleor Dashboard

- Make sure you're still signed in into Saleor by refreshing the page
- Make sure you're using correct App token in your Vercel configuration
  - You have to generate the app token as described in the [Vercel deployment guide](./vercel.md#5-generate-app-token)
  - You cannot use the token from "Local apps", the token has to be connected with your installed Checkout App
- Reinstall the app in Saleor
  1. Uninstall the app in Saleor Dashboard
  2. [Install the app again](./vercel.md#4-install-the-app-in-saleor)
  3. [Generate new App token](./vercel.md#5-generate-app-token)
  4. [Update Vercel environment variables](./vercel.md#6-update-environment-variables-in-vercel) with new value of `SALEOR_APP_TOKEN`
  5. Redeploy the app, **don't use** the "Redeploy with existing Build Cache" option

## I get missing permission error

Check solutions for ["Unauthorized" error](#i-get-unauthorized-error-message-in-saleor-dashboard)

## I don't see any delivery methods

- Check country you're providing in checkout as shipping address
  - It must be assigned to a shipping zone
- Check your shipping zone (Dashboard > Configuration > Shipping Methods):
  - If it has a country assigned that you're using in checkout as shipping address
    ![](./screenshots/faq/shipping-zone-countries.png)
  - If it has any shipping rate configured that:
    - matches your product weight limit
    - doesn't have your product excluded
    - doesn't have your shipping address's postal code excluded
      ![](./screenshots/faq/shipping-zone-shipping-rate.png)
  - If it's assigned to the same channel as your checkout
    ![](./screenshots/faq/shipping-zone-channels.png)
    ```graphql
      mutation {
        checkoutCreate(
          input: {
            channel: "default-channel" # <- Channel slug must be the same as in shipping zone
            # ...
        ) {
          checkout {
            channel
          }
        }
      }
    ```
  - If it's assigned to the same warehouse as products in your checkout
    ![](./screenshots/faq/shipping-zone-warehouses.png)
- Check the warehouse that has the products from your checkout (Dashboard > Configuration > Warehouses)
  - If it has correctly assigned shipping zones
    ![](./screenshots/faq/warehouse-shipping-zones.png)

## I don't get any payment methods

- Make sure you've enabled payment methods in Checkout App configuration
  ![](./screenshots/faq/saleor-app-checkout-payment-methods.png)
- Make sure you've configured payment gateway API keys
  ![](./screenshots/faq/saleor-app-checkout-payment-api-keys.png)
- Make sure you're using correct App token in your Vercel configuration
  - Check solutions for ["Unauthorized" error](#i-get-unauthorized-error-message-in-saleor-dashboard)

## I get "Checkout not found" error after clicking "Pay"

The checkout was turned into an order in Saleor, thus deleting checkout session. You need to create a new checkout session.

## I get `No matching version found for saleor-app-checkout@* inside the workspace` in Vercel deployment

Check in your project settings if you have "Include source files outside of the Root Directory in the Build Step" option enabled:

![](./screenshots/faq/vercel-include-source-files.png)

## I get `"Error: No Output Directory named "build"` in my Vercel deployments.

Check in your project settings if you've correctly selected the Root Directory.

If you need to know what Root Directory should be set, check the [deployment guide](./vercel.md) for:

- [checkout](./vercel.md#2-configure-new-project-for-checkout)
- [saleor-app-checkout](./vercel.md#2-configuring-new-project-for-saleor-app-checkout)

## I get error `Error: Cannot find module [...] /node_modules/next/dist/...`

Clear `.next` folder inside app or package that's producing this issue

```bash
rm -rf apps/storefront/.next
```

## I get error "Looks like you're using the deprecated `.auth_token` file or the deprecated `NEXT_PUBLIC_SALEOR_API_URL` env variable."

Please remove the `.auth_token` in all folders:

```bash
pnpm run clean-auth-files
```

then follow the instruction displayed in that error message and create a `.saleor-app-auth.json` files

Make sure you're not using `NEXT_PUBLIC_SALEOR_API_URL` environment variable.

## Adyen dropin displays "Unauthorized origin"

Please add `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002` to your credentials allowed origins in Adyen Dashboard or inside [Adyen Payment App](https://github.com/saleor/saleor-app-payment-adyen)

## I get weird error messages while installing dependencies

Make sure you're using the correct `pnpm` version. Check your version:

```bash
pnpm --version
```

and compare it to the version described in README.md and in `package.json` > engines > pnpm

If your using newer or older version, install the correct one by using the command in README.md or use a version manager like [proto](https://moonrepo.dev/docs/proto/install)

After that remove all dependencies and `pnpm-lock.yaml`:

```bash
pnpm run clean-deps
```

## I get error `Invariant Violation: No auth data found for given host: https://witoszek-dev.eu.saleor.cloud/graphql/. Is the app installed and configured?`

Make sure that the app is installed in the displayed Saleor instance by visiting Dashboard and checking the list of apps.

## The products displayed in storefront don't match my products in Saleor

Make sure you've updated your `SALEOR_API_URL` env variable to match URL to your Saleor instance GraphQL endpoint (e.g. `https://my-saleor.saleor.cloud/graphql/`).

You can override environment variables by creating `.env.local` file or, if you want to update your production deployment, settings in your hosting provider (e.g. [Vercel](https://vercel.com/docs/concepts/projects/environment-variables))

### Local development

If the app is installed correctly, check if the credentials for accessing Saleor were saved in `.saleor-app-auth.json` file.
If it's missing, delete that file and install the app again.
Make sure that the `APL` env variable is set to `file`.

### Production

If the app is installed correctly, make sure that the selected method for storing credentials set in `APL` env variable works corerctly.
The implementation for different APLs is located in `apps/saleor-app-checkout/config/apl.ts`

For example if you're using `upstash`, make sure it's reachable by your app.

## For contributors

### My env vars are empty / don't have correct values

#### In Next.js

By default `.env` file uses environment variables that are when the project is run from the root of monorepo (e.g. `pnpm run dev --filter=saleor-app-checkout`).
If the project is run from this directory (e.g. `cd apps/saleor-app-checkout && pnpm run dev`) then those variables wouldn't be available. That's why `env-vars` package is used for loading both env variables from root of monorepo and from the project directory.

For more details check `env-vars` package.

- Check order of your env variables. They are loaded in this order:

  - `apps/**/.env.local`
  - `apps/**/.env.development`
  - `apps/**/.env`
  - `.env.local` (root of monorepo)
  - `.env` (root of monorepo)
    If you define a variable with the same name in `.env.local` and in `.env` then the variable from `.env.local` takes precedence.

- Check order of your env variables in the file. Variables defined later in the file, override already defined variables.
  For example:

```bash
MY_ENV=initial_value
# ...
MY_ENV=overriden_value # this overrides `initial_value` with `overriden_value`
```

- Check if you're accessing the variables in correct way: dynamic lookups to `process.env` won't work in the browser. [Read more in Next.js docs](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)

#### In Node

To load environment variables in other packages, that don't use Next.js make sure to import `env-vars` package.

You can do this by:

- using `--require` parameter in Node CLI:

```bash
node --require 'env-vars' index.js
```

- Using `NODE_OPTIONS` env variable to pass parameters like you would do with Node CLI:

```bash
NODE_OPTIONS='--require 'env-vars'' my_command
```

- Import the package at the top of your entry file (ex. `index.js`)

```js
import "env-vars";
// or with CommonJS
require("env-vars");
```
