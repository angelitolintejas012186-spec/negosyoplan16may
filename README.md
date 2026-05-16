# Negosyo Plan - Business Blueprint Website

A complete, production-ready website for selling downloadable digital PDF products focused on business planning for Overseas Filipino Workers (OFWs) and aspiring entrepreneurs.

## Features

- **Brand Identity**: "Negosyo Plan" with ultra-realistic golden bar text effect
- **Product Catalog**: 4 PDF bundles (Starter, Founder, Complete Set, Custom)
- **E-commerce Flow**: Add to cart, checkout, payment simulation, downloads
- **User Accounts**: Registration, login, order history, downloads
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **SEO Optimized**: Meta tags, structured data, sitemap, robots.txt
- **Social Integration**: WhatsApp, Facebook, Instagram, Twitter, LinkedIn

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Custom CSS with variables, gradients, and animations
- **Icons**: FontAwesome 6
- **Fonts**: Google Fonts (Poppins & Inter)
- **Storage**: localStorage for cart, purchases, and user data
- **Images**: Unsplash API for professional product images

## Project Structure

```
negosyo-plan/
├── index.html              # Home page with hero, products, testimonials
├── shop.html               # Product catalog
├── product.html            # Dynamic product detail page
├── cart.html               # Shopping cart
├── checkout.html           # Checkout form with payment simulation
├── thank-you.html          # Post-purchase confirmation
├── downloads.html          # Download purchased products
├── account.html            # User account management
├── about.html              # About page with mission, vision, stories
├── css/
│   └── style.css           # Main stylesheet with golden text effect
├── js/
│   ├── main.js             # Shared utilities and navigation
│   ├── cart.js             # Cart management
│   ├── checkout.js         # Payment processing
│   ├── downloads.js        # Download functionality
│   ├── product.js          # Product detail page
│   ├── account.js          # User account features
│   └── testimonials.js     # Dynamic testimonials
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine crawling rules
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- VS Code with Live Server extension (recommended)

### Installation

1. Clone or download the project files
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The website will open in your default browser

### Testing the Website

#### Cart and Checkout Flow
1. Visit the Shop page (`shop.html`)
2. Click "Add to Cart" on any product
3. View cart by clicking the cart icon in navigation
4. Adjust quantities or remove items
5. Proceed to checkout
6. Fill out the form and click "Complete Purchase"
7. View the thank you page and download links

#### Account Management
1. Visit the Account page (`account.html`)
2. Register with an email address
3. Login with the same email
4. View order history and downloads

#### Product Details
1. From the shop or home page, click "View Details" on any product
2. Browse product information, ratings, and reviews

## Customization

### WhatsApp Integration
- Replace `1234567890` in all HTML files with your actual WhatsApp number
- Update the WhatsApp links to include your business message

### Social Media Links
- Update social media URLs in footer and about page:
  - Facebook: `https://facebook.com/negosyoplan`
  - Instagram: `https://instagram.com/negosyoplan`
  - Twitter: `https://twitter.com/negosyoplan`
  - LinkedIn: `https://linkedin.com/company/negosyoplan`

### Adding Real PDF Downloads
- Replace the demo download links with actual PDF file URLs
- Update the `downloadProduct()` function in `downloads.js`
- Host PDF files in a secure location

### Payment Integration
- For real Stripe integration, replace the test key in `checkout.js`
- Implement proper webhook handling for production
- Add server-side validation and security

### Product Images
- Replace Unsplash URLs with your own professional images
- Ensure images are optimized for web (WebP format recommended)
- Maintain consistent aspect ratios

## Key Features Explained

### Golden Bar Text Effect
The brand name "Negosyo Plan" uses advanced CSS techniques:
- Multiple `text-shadow` layers for 3D depth
- Linear gradients for metallic appearance
- Transform properties for slight rotation
- Custom font with letter spacing

### Product Images
Each bundle features:
- High-quality Unsplash images
- PDF badge overlay
- Hover zoom effects
- Consistent styling with brand colors

### Cart Management
- localStorage-based cart persistence
- Quantity adjustment
- Subtotal calculations
- Cart badge in navigation

### Checkout Process
- Form validation
- Payment simulation (demo mode)
- Purchase record storage
- Automatic cart clearing

### User Accounts
- Mock authentication with localStorage
- Order history tracking
- Download management
- Tabbed interface

## SEO and Performance

- Semantic HTML5 structure
- Open Graph meta tags for social sharing
- JSON-LD structured data for products
- Compressed images and lazy loading
- Minimal external dependencies
- Fast loading with critical CSS

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

This is a demo project. For production use:
1. Implement server-side authentication
2. Add real payment processing
3. Set up proper file hosting for PDFs
4. Add analytics and tracking
5. Implement email notifications

## License

This project is for demonstration purposes. Modify and use as needed for your business requirements.

## Support

For questions or customization requests, contact via WhatsApp or the social media links provided.