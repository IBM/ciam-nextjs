# VeriInsure - IBM Security Verify Demo

VeriInsure is a demo application showcasing the integration of IBM Security Verify for customer identity and access management (CIAM) in a Next.js application. It provides a sample insurance-themed web application that demonstrates various authentication and user management flows.

## Features

- **User Registration:** New users can sign up for an account.
- **User Login:** Existing users can log in using their credentials.
- **Passwordless Login:** Support for passwordless authentication using email-based one-time passcodes (OTPs).
- **Social Login:** Integration with social identity providers.
- **User Profile Management:** Users can view and manage their profile information.
- **Change Password:** Authenticated users can change their password.
- **Forgot Password:** A flow for users to recover their forgotten passwords.
- **Multi-Factor Authentication (MFA):** Demonstrates how to enforce MFA for enhanced security.
- **Session Management:** Securely manages user sessions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/)
- An [IBM Security Verify](https://www.ibm.com/products/verify) tenant.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/IBM/ciam-nextjs.git
    cd ciam-nextjs
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up your environment variables:**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your IBM Security Verify tenant details and application credentials. You can find these values in your Verify tenant's admin console.

    - `tenantUrl`: Your IBM Security Verify tenant URL (e.g., `https://<your-tenant>.ice.ibmcloud.com`).
    - `clientId`: The client ID for your API client.
    - `clientSecret`: The client secret for your API client.
    - `redirectClientId`: The client ID for your OIDC application.
    - `redirectClientSecret`: The client secret for your OIDC application.
    - `scope`: The scopes you want to request (e.g., `openid profile email`).
    - `CE_URL`: The base URL of your application (e.g., `http://localhost:3000/`).

4.  **Run the development server:**

    ```bash
    pnpm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about IBM Security Verify, take a look at the following resources:

- [IBM Security Verify Documentation](https://www.ibm.com/docs/en/security-verify) - learn about Verify features and capabilities.
- [IBM Security Verify APIs](https://<your-tenant>.ice.ibmcloud.com/developer/) - learn about the Verify APIs.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
