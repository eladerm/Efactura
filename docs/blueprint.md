# **App Name**: Elapiel eFactura

## Core Features:

- Authentication and Role Management: Secure user authentication with Firebase Auth and role-based access control (Admin, Facturador, Consulta) to manage permissions.
- SRI Configuration: Allows ADMIN users to configure SRI parameters such as environment (TEST/PROD), default establishment and point of emission, and upload the .p12 certificate.
- Customer Management: CRUD (Create, Read, Update, Delete) functionality for managing customer information.
- Product/Service Management: CRUD functionality for managing products and services, including setting IVA (tax) and discounts.
- Invoice Emission: Allows users to create and issue electronic invoices with item selection, total calculation, and payment method selection.
- Invoice Processing: Generates the XML for invoices according to the required XSD schema; signs the XML with XAdES-BES using the digital certificate, sends signed XML to SRI for reception, checks SRI for authorization, generates a RIDE PDF, and persists XML and RIDE PDF in Cloud Storage.
- Document Status Tracking and Management: Keeps track of document status, including document logs; Allows for retrying failed authorization attempts and downloading XML and PDF files.

## Style Guidelines:

- Primary color: Dark purple (#301934) to provide a sophisticated and modern feel.
- Secondary color: Light purple (#9F2B68) for accents and highlights.
- Accent color: Hot pink (#E0115F) for call-to-action buttons and important information.
- Body and headline font: 'Poppins' (sans-serif) for a clean and readable look.
- Use minimalist and modern icons to represent actions and status.
- Clean and well-organized layout with a focus on data presentation and usability.
- Subtle animations to indicate processing status or provide feedback on user interactions.