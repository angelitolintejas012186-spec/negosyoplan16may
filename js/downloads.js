// downloads.js - Downloads page and comprehensive blueprint generation

const FREE_RESOURCES = [
    { id: 'free-1', title: 'Business Idea Validation Checklist', description: 'A 10-point checklist to quickly assess whether your business idea is ready to launch.', icon: 'fas fa-clipboard-check' },
    { id: 'free-2', title: 'OFW Entrepreneur Starter Guide', description: 'Essential tips for overseas Filipino workers planning to invest in a business back home.', icon: 'fas fa-globe-asia' },
    { id: 'free-3', title: 'Filipino Market Research Template', description: 'Research demand for your product or service with this structured market analysis template.', icon: 'fas fa-chart-bar' },
    { id: 'free-4', title: 'Startup Budget Planner', description: 'A simple budget spreadsheet to plan your startup costs and monthly operating expenses.', icon: 'fas fa-calculator' }
];

// ─── Business-type content database ────────────────────────────────────────

const BT_CONTENT = {
    mini_grocery: {
        label: 'Mini Grocery / Sari-Sari Store',
        mgmt_checklist: [
            'Count opening cash and verify POS float',
            'Check all product displays are properly stocked and faced',
            'Inspect all perishables (bread, dairy, eggs) for freshness',
            'Verify cooler/refrigerator temperatures (below 4°C for dairy)',
            'Restock fast-moving items (softdrinks, instant noodles, snacks)',
            'Check for expired or near-expiry items — pull and document',
            'Accept and verify supplier deliveries against delivery receipts',
            'Reconcile end-of-day cash with sales receipts'
        ],
        swot: {
            strengths: ['Convenient location within walking distance of community', 'Personal customer relationships and trust', 'Flexible credit (utang) for loyal regular customers', 'Lower overhead than supermarkets or convenience chains', 'Can source locally preferred products and brands', 'Quick adaptability to community needs and preferences'],
            weaknesses: ['Limited purchasing power vs. large grocery chains', 'Small storage space restricts product variety', 'Highly dependent on owner\'s daily presence', 'Cannot always match chain store prices on popular items', 'No formal inventory system leading to expiry losses', 'Limited access to formal business financing'],
            opportunities: ['In-store GCash/Maya payment terminal attracts more buyers', 'Home delivery service for elderly and busy households', 'Bulk order supply to nearby eateries and canteens', 'Community loyalty card to retain and reward regulars', 'FB Marketplace and Viber group for online orders', 'School supplies section during June–August season'],
            threats: ['7-Eleven, Ministop, and AllDay convenience store expansion', 'Rising wholesale prices reducing margins', 'New sari-sari store competition within the same barangay', 'Economic downturns reducing household spending', 'Inventory shrinkage from shoplifting', 'Supplier delivery delays during weather disruptions']
        },
        fifo_examples: [
            ['Canned goods', 'Place newly delivered cans BEHIND existing stock. Sell front items first.'],
            ['Bread & pandesal', 'Rotate daily — morning delivery goes behind yesterday\'s remaining stock.'],
            ['Dairy (milk, butter)', 'Always check expiry before shelving. Front = oldest; Back = newest.'],
            ['Eggs', 'Date-stamp each tray on arrival. Sell earliest-dated tray first.'],
            ['Softdrinks & juices', 'Batch rotate weekly. Check for bloating or leaks before sale.'],
            ['Instant noodles / snacks', 'Check best-before dates monthly; apply FIFO by production batch.']
        ],
        top_risks: [
            ['High', 'High', 'Slow initial sales in first 30 days', 'Pre-launch promotions; grand opening discount; SMS blast to community'],
            ['Medium', 'High', 'Expired goods causing financial loss', 'Daily FIFO checks; weekly near-expiry audit; bundle deals for aging stock'],
            ['Medium', 'High', 'Theft and shoplifting (shrinkage)', 'Install CCTV; visible counter position; bagged items policy'],
            ['Medium', 'High', 'Cash flow shortfall between supplier payments', 'Maintain 45-day operating reserve; negotiate 30-day supplier credit'],
            ['Low', 'High', 'Supplier non-delivery on key items', 'Dual-supplier policy for top 20 items; 5-day buffer stock always kept'],
            ['Medium', 'Medium', 'Competitor opens nearby', 'Differentiation: unique items, credit for regulars, delivery service'],
            ['Low', 'High', 'Health & sanitation inspection failure', 'Monthly self-audit using DTI/DOH checklist; proper food storage protocols'],
            ['Medium', 'Medium', 'Owner illness or absence disrupts operations', 'Train a trusted family member or assistant to manage independently']
        ],
        startup_items: [
            ['Shelving & display fixtures', 8000],
            ['Initial stock & inventory', 28000],
            ['Refrigerator/cooler (2nd hand)', 7000],
            ['Business permits & licenses', 3500],
            ['Signage & tarpaulin', 2000],
            ['POS tablet & cash drawer', 3000],
            ['Packaging (bags, labels)', 1000]
        ],
        monthly_costs: [
            ['Rent (if applicable)', 5000],
            ['Utilities (electricity, water)', 2000],
            ['Stock replenishment', 22000],
            ['Transportation (supplier pickup)', 1000],
            ['Packaging supplies', 500],
            ['Mobile data (GCash, social media)', 300]
        ],
        margin_pct: 20,
        trad_marketing: [
            ['Tarpaulin Signage', 'Place 4×8 ft tarpaulin at your storefront and nearest road corner. Include store name, hours (e.g. 6AM–10PM), contact number, and payment logos (GCash, Maya).'],
            ['Leaflet Distribution', 'Print 100 leaflets (A5 size) with your opening promo. Distribute door-to-door within 300m radius. Focus on households near you.'],
            ['Barangay Bulletin Board', 'Post monthly flyers on barangay bulletin boards and community notice boards. Highlight specials and new stock arrivals.'],
            ['Grand Opening Promo', 'First week: 10% discount on all items, or free small item with PHP 150 purchase. Create word-of-mouth excitement.'],
            ['Loyalty Card', 'Paper loyalty card: "Buy 10, Get 1 Free" on any single item. Encourages repeat visits.'],
            ['Seasonal Sales', 'Christmas, New Year, school opening (June), All Saints Day — plan special bundle deals 2 weeks ahead.']
        ],
        digital_marketing: [
            ['Facebook Business Page', 'Create a business page (not personal profile). Use your store name. Fill in: address, hours, phone number. Post at least 3x per week.'],
            ['FB Posts Strategy', 'Monday: "Fresh stocks today!" + product photo. Wednesday: Mid-week promo + price. Friday: Weekend specials. Sunday: Community update or customer shoutout.'],
            ['Facebook Ads', 'Run a PHP 50/day Local Awareness ad targeting 3km radius, ages 18–55. Objective: "Get More Store Visits." Run Thursday–Sunday 4PM–9PM.'],
            ['WhatsApp Business', 'Set up WhatsApp Business with store hours and catalog. Accept orders via chat. Send broadcast promos to regular customers weekly.'],
            ['Google My Business', 'List your store for free at business.google.com. Add store photos, exact address, hours. Ask satisfied customers to leave reviews.'],
            ['FB Marketplace', 'List your top 10 products on Facebook Marketplace for free. Use clear product photos and mention pickup or local delivery option.']
        ]
    },

    restaurant: {
        label: 'Restaurant / Carinderia',
        mgmt_checklist: [
            'Check all food prep stations are clean and sanitized',
            'Verify mise en place (ingredient prep) for the day\'s menu',
            'Inspect all fresh ingredients for freshness and quality',
            'Check cooking equipment: stoves, fryers, grill are functional',
            'Ensure sufficient LPG/gas supply before service begins',
            'Set daily specials based on available surplus ingredients',
            'Brief staff on daily specials, expected covers, and service standards',
            'Reconcile end-of-day sales with POS or manual receipts'
        ],
        swot: {
            strengths: ['Home-cooked quality that chains cannot replicate', 'Local and regional flavor that customers are loyal to', 'Personal relationships with regular diners', 'Lower price point than fast food chains', 'Flexible menu customization for events and catering', 'Quick adaptation to customer feedback on dishes'],
            weaknesses: ['Perishable food inventory creates daily waste risk', 'Business heavily dependent on head cook\'s skills', 'Limited seating capacity vs. revenue potential', 'No delivery infrastructure at launch', 'Inconsistent food quality without proper SOPs', 'Working capital tied up in daily food purchases'],
            opportunities: ['GrabFood and Foodpanda platform listing for delivery', 'Catering services for events, meetings, birthdays', 'Baon (packed lunch) service for nearby offices', 'Social media viral potential from food photography', 'Set meal packages for student and worker lunch crowd', 'Private dining room or events hosting'],
            threats: ['Food safety & sanitation inspections (DOH/LGU)', 'Cook or kitchen staff resignation disrupts operations', 'Rising wholesale food and ingredient costs', 'New competitor restaurants in same area', 'Changing customer tastes and dietary trends', 'Seasonal weather reducing foot traffic']
        },
        fifo_examples: [
            ['Raw meat & poultry', 'Date-stamp all deliveries. Use FIFO in freezer: first in goes in front. Thaw only daily portions.'],
            ['Fresh vegetables', 'Sort delivery on arrival: wilting items prep today; fresh items store. Never mix old and new in same container.'],
            ['Cooked food/soups', 'Label cooked batches with time. Discard after 4 hours at room temp. Refrigerate within 2 hours if not sold.'],
            ['Rice', 'Cook in controlled batches based on expected covers. Leftover rice: refrigerate same day, use for fried rice next morning.'],
            ['Condiments & sauces', 'Date-open all bottles and jars. Refrigerate after opening. Discard per manufacturer\'s shelf life.'],
            ['Eggs', 'Store at consistent cool temp. Use oldest eggs first. Check for cracks before using. Date tray on delivery.']
        ],
        top_risks: [
            ['High', 'High', 'Low initial customer volume', 'Grand opening promos; partner with GrabFood; distribute flyers at nearby offices'],
            ['High', 'Medium', 'Daily food waste from unsold meals', 'Cook in controlled batches; offer half-order options; repurpose into new dishes'],
            ['Medium', 'High', 'Key cook leaves without notice', 'Document all recipes with measurements; cross-train at least one backup cook'],
            ['Medium', 'High', 'Health and sanitation violation closure', 'Monthly internal audit; proper food temp logs; FIFO strictly enforced'],
            ['Low', 'High', 'Food poisoning incident', 'Strict food safety training; temperature monitoring; never serve questionable food'],
            ['Medium', 'Medium', 'Rising food cost eroding margins', 'Monthly cost-per-dish review; negotiate supplier contracts; adjust menu pricing'],
            ['Medium', 'Medium', 'Competitor restaurant opens nearby', 'Differentiate with house special; faster service; loyalty discount for regulars'],
            ['Medium', 'High', 'LPG or utility disruption during service', 'Keep 1 spare tank always on-hand; backup portable burner for emergencies']
        ],
        startup_items: [
            ['Commercial gas range (2-4 burners)', 18000],
            ['Commercial refrigerator', 12000],
            ['Cooking utensils, pots, pans', 6000],
            ['Tables & chairs (10–15 pax)', 12000],
            ['Plates, bowls, glasses, flatware', 5000],
            ['Business permits & health cert.', 5000],
            ['Initial food inventory', 10000],
            ['Signage & tarpaulin', 2500]
        ],
        monthly_costs: [
            ['Rent', 8000],
            ['Utilities (electricity, water, gas)', 6000],
            ['Food & ingredient purchases', 30000],
            ['Staff wages (1-2 helpers)', 12000],
            ['Packaging (takeout containers)', 1500],
            ['Cleaning supplies', 800]
        ],
        margin_pct: 55,
        trad_marketing: [
            ['Street Tarpaulin', 'Place 4×8 ft tarpaulin with food photos, menu highlights, and price. Include "Now Open" burst for first month.'],
            ['Lunch Box Delivery Flyers', 'Target nearby offices and schools. Offer daily meal package (e.g., PHP 120 = rice + viand + soup + drink). Distribute flyers every Monday.'],
            ['Barangay Bulletin Board', 'Post weekly menus and specials. Update regularly to show active management.'],
            ['Referral Incentive', '"Refer a friend and get a free drink." Simple word-of-mouth multiplier for a small daily cost.'],
            ['Business Cards', 'Include your number for call-in orders and catering inquiries. Leave at nearby businesses, churches, schools.'],
            ['Raffle / Contest', 'Monthly "Loyal Diner" raffle: customers who eat 5+ times enter to win a free meal for 2. Collect stubs to build customer list.']
        ],
        digital_marketing: [
            ['GrabFood / Foodpanda Listing', 'Register as a merchant. Delivery radius covers 3–5km automatically. Takes 1–2 weeks for approval. Commission: 25-30% per order.'],
            ['Instagram Food Photography', 'Post 3–5 photos per week. Natural light, overhead shot or 45-degree angle. Use local hashtags: #[CityFood], #[BusinessName], #CarinderiaLife.'],
            ['Facebook Page Daily Posts', 'Post your daily menu every morning by 7AM. Include prices, photos of actual dishes. Run "Guess the dish" polls for engagement.'],
            ['TikTok Food Videos', 'Short 15-30 second cooking or plating videos. "Lutong-bahay" style content gets high organic reach in PH.'],
            ['Facebook Ads (Food)', 'PHP 100/day ad targeting 5km radius. Use your best food photo. Objective: "Get Messages." Hours: 10AM–1PM (lunch) and 5PM–8PM (dinner).'],
            ['Google My Business', 'Upload 10+ food photos. Ask regulars to leave Google reviews. Use Posts feature for daily specials.']
        ]
    },

    food_cart: {
        label: 'Food Cart / Street Food',
        mgmt_checklist: [
            'Check cart equipment and LPG level before setup',
            'Verify all ingredients are fresh and properly prepped',
            'Set up cart in designated spot; arrange condiments and packaging',
            'Monitor inventory levels hourly; restock from backup supply',
            'Track sales count per batch for waste reduction',
            'Count revenue and reconcile with ingredient usage at day end',
            'Clean and sanitize cart thoroughly after operations',
            'Report any equipment issues for next-day repair'
        ],
        swot: {
            strengths: ['Very low startup capital vs. restaurant', 'High foot traffic location is key advantage', 'Fast service model suits commuter customers', 'Simple menu reduces waste and training time', 'Mobility — relocate if location underperforms', 'Cash-based business simplifies operations'],
            weaknesses: ['Weather-dependent sales (rain = low traffic)', 'Limited menu variety vs. established restaurants', 'No seating; eat-on-the-go only', 'LGU permit and location restrictions', 'No delivery capability initially', 'Physical fatigue of long outdoor hours'],
            opportunities: ['School and office area lunch rush premium', 'Event catering (barangay fiesta, company events)', 'Franchise second cart with proven model', 'Add delivery via motorcycle for nearby offices', 'Expand to night market or weekend bazaar', 'Signature sauce or product as separate reselling'],
            threats: ['LGU clearing operations removing street vendors', 'Competition from other food carts in same spot', 'Bad weather weeks reducing income significantly', 'Rising ingredient prices reducing margins', 'Customer food preference changes', 'Health inspection failure due to outdoor conditions']
        },
        fifo_examples: [
            ['Skewered meats (isaw, BBQ)', 'Prepare maximum 2-hour batches. Unsold skewers: refrigerate, reheat for next batch. Discard after 24h.'],
            ['Fried items (kwek-kwek, okoy)', 'Fry in small batches to maintain crispiness. Never sell soggy items. Prepare batter fresh each batch.'],
            ['Sauces and condiments', 'Prepare fresh sauces daily or in small batches. Label containers with date. Refrigerate. Discard after 2 days.'],
            ['Bread & buns (hotdog)', 'Rotate same-day delivery bread. Store in sealed container to prevent staleness.'],
            ['Drinks (sago, gulaman)', 'Prepare fresh each morning. Refrigerate in dispensers. Discard unsold after close of day.']
        ],
        top_risks: [
            ['High', 'High', 'LGU permit revocation or clearance', 'Secure proper health and business permits; never operate without clearance'],
            ['High', 'Medium', 'Rainy season 2-3x drop in sales', 'Build 60-day emergency fund; plan for covered location or tent'],
            ['Medium', 'High', 'Food safety complaint or illness report', 'Strict hygiene: gloves, clean water, freshness checks; never reuse day-old prep'],
            ['Medium', 'Medium', 'Equipment breakdown (fryer, grill)', 'Budget for maintenance; keep basic tools kit; know a nearby repair shop'],
            ['Low', 'High', 'Location forced to move (road work, etc.)', 'Identify 2-3 backup locations in advance; build relationships with property owners'],
            ['Medium', 'Medium', 'Competitor undercuts price', 'Focus on quality and consistency over price wars; add unique item'],
            ['Medium', 'Medium', 'Ingredient cost spike (oil, LP gas)', 'Buy in bulk monthly; track cost-per-piece daily to maintain margins'],
            ['Low', 'Medium', 'Customer complaint on social media', 'Respond professionally; offer resolution; never argue publicly']
        ],
        startup_items: [
            ['Food cart (custom-built or pre-made)', 12000],
            ['Fryer / grill / cooking equipment', 5000],
            ['LPG tank + regulator', 2000],
            ['Initial ingredient inventory', 5000],
            ['Permits (health cert, business permit)', 2500],
            ['Packaging & condiment dispensers', 1500],
            ['Signage & cart branding', 2000]
        ],
        monthly_costs: [
            ['Location rental/permit fee', 2000],
            ['LPG refills', 800],
            ['Daily ingredients', 8000],
            ['Packaging materials', 1000],
            ['Transportation to location', 600],
            ['Maintenance & misc', 500]
        ],
        margin_pct: 60,
        trad_marketing: [
            ['Cart Branding', 'A well-designed cart with logo, colors, and menu board is your best marketing. Invest in professional cart design.'],
            ['Sample Giveaways', 'Opening week: offer 1 free piece to passersby. Let the product sell itself. Attract the first 50 customers.'],
            ['Handwritten Signs', 'Daily chalk or marker board near cart: "Today\'s Special" or "12 pcs for PHP 99." Visible pricing attracts impulse buys.'],
            ['Loyalty Punch Card', '"Buy 10 get 1 free" punch card. Simple, cost-effective repeat business driver.'],
            ['Word of Mouth', 'Greet every customer by name after the first visit. Remember their preferences. This is your competitive edge.'],
            ['Partner with Nearby Business', 'Partner with nearby tindahan or store to place your calling card or small flyer near their cashier.']
        ],
        digital_marketing: [
            ['Facebook Business Page', 'Post your daily location and hours every morning. Use FB Live occasionally to show fresh food preparation.'],
            ['Instagram Reels', 'Short clips of sizzling BBQ or colorful kwek-kwek get high reach. "Satisfying food" content is very shareable.'],
            ['TikTok (ASMR Food)', 'ASMR food prep and eating videos are trending. A single viral TikTok can bring hundreds of new customers.'],
            ['Location Pin on FB', 'Pin your exact location on Facebook every day so customers can find you easily. Use Facebook Check-In feature.'],
            ['Facebook Group Posts', 'Join local barangay or community Facebook groups. Post your daily spot and menu. Most groups allow food posts.'],
            ['WhatsApp for Pre-orders', 'Accept advance orders via WhatsApp for group orders. "Order 20 sticks, ready in 30 minutes" builds office market.']
        ]
    },

    bakery: {
        label: 'Bakery / Pastry Shop',
        mgmt_checklist: [
            'Check oven temperatures and equipment calibration',
            'Confirm daily production schedule and quantities',
            'Verify ingredient stock: flour, sugar, butter, eggs, yeast',
            'Review previous day\'s sales to adjust today\'s production',
            'Inspect display cases: clean, stocked, priced clearly',
            'Apply FIFO on yesterday\'s remaining items (bundle discounts)',
            'Log daily production output and wastage',
            'Cash reconciliation at close; update ingredient inventory'
        ],
        swot: {
            strengths: ['Fresh, daily-baked goods create strong repeat demand', 'Unique recipes are hard for competitors to replicate', 'High perceived value for celebration cakes and pastries', 'Can cater events and custom orders at premium prices', 'Bakery aroma is a natural marketing tool', 'Loyal morning rush customers are highly predictable'],
            weaknesses: ['Short product shelf life creates daily waste risk', 'Highly dependent on baker\'s skill and consistency', 'Equipment-intensive startup costs (oven, mixer)', 'Early morning production hours are demanding', 'Seasonal demand peaks (Christmas) require extra capacity', 'Limited shelf life prevents large advance production'],
            opportunities: ['Custom cake orders for birthdays, graduations, weddings', 'Pandesal + coffee daily set for morning rush', 'Health-conscious line (ube, kamote, whole wheat)', 'Holiday bulk orders (Christmas ensaymada, suman)', 'Catering for corporate snacks and meetings', 'Online orders and Pasabuy service'],
            threats: ['Established local bakeries with existing loyal customer base', 'Industrial bakery deliveries (Gardenia, Marby) at lower prices', 'Rising flour, sugar, and butter costs', 'Power outages disrupting refrigeration and proofing', 'Changing health preferences reducing white bread sales', 'Copycat recipes by competitors']
        },
        fifo_examples: [
            ['Breads (pandesal, loaf)', 'Fresh in the morning; leftover AM bread sold at 50% off at PM. Day-old bread sold as "pan de tinapay" or charity.'],
            ['Cakes (whole cakes)', 'Display max 3 days. Day 3: 30% discount. Day 4: discard or convert to cake pops.'],
            ['Eggs', 'Date all deliveries. Use earliest expiry first. Refrigerate at all times.'],
            ['Flour & baking powder', 'Store in sealed containers. Use batch opened first. Check for weevils monthly.'],
            ['Butter & margarine', 'Refrigerate. Use opened package before opening new one. Track expiry date.'],
            ['Fillings (ube, custard)', 'Prepared fillings: label with date, refrigerate, use within 3 days maximum.']
        ],
        top_risks: [
            ['High', 'High', 'Inconsistent product quality driving customers away', 'Standardize all recipes with exact weights; train to consistent standard'],
            ['Medium', 'High', 'Baker (owner or key staff) gets sick or leaves', 'Document all recipes in detail; train a second person on core products'],
            ['High', 'Medium', 'Daily over-production creating waste', 'Track sales data daily; adjust production schedule after 2-week baseline'],
            ['Low', 'High', 'Oven or mixer breakdown halting production', 'Annual maintenance contract; basic spare parts kept on-hand'],
            ['Medium', 'Medium', 'Rising flour and butter prices', 'Buy flour in 50kg sacks from Divisoria/NFA for better pricing; lock in supplier rates'],
            ['Medium', 'Medium', 'Health permit violation (mold, contamination)', 'Strict kitchen hygiene; sealed ingredient storage; pest control quarterly'],
            ['Low', 'High', 'Fire hazard from oven malfunction', 'Fire extinguisher near oven; regular electrical check; no flammable near oven'],
            ['Medium', 'Medium', 'Seasonal sales slump (summer months)', 'Summer line: cold pastries, ensaymada to-go, refreshing items']
        ],
        startup_items: [
            ['Commercial oven (deck or convection)', 35000],
            ['Stand mixer (commercial grade)', 15000],
            ['Proofing equipment', 5000],
            ['Display case / showcase', 12000],
            ['Baking tools & molds', 5000],
            ['Initial ingredients (1-month supply)', 12000],
            ['Business permits & sanitary cert.', 4000],
            ['Signage & packaging materials', 3500]
        ],
        monthly_costs: [
            ['Rent', 6000],
            ['Utilities (oven electricity, water)', 5000],
            ['Ingredients (flour, sugar, butter, eggs)', 25000],
            ['Packaging (boxes, bags, stickers)', 2000],
            ['Staff (if any)', 10000],
            ['Maintenance', 800]
        ],
        margin_pct: 50,
        trad_marketing: [
            ['Fresh Aroma Marketing', 'Keep front windows open during peak baking. The smell of fresh bread is your #1 free marketing tool.'],
            ['Grand Opening Sampling', 'Opening week: free pandesal sampling outside your store. Let 200 people taste your product in the first 3 days.'],
            ['Local Community Tying', 'Partner with nearby church for buhangin bread during mass. Offer school canteen supply deal.'],
            ['Seasonal Product Calendar', 'Plan products by season: Christmas (ensaymada, bibingka), Lent (puto, kutsinta), Valentines (heart cakes).'],
            ['Custom Cake Portfolio', 'Display printed photos of your best custom cakes. Customers buy with their eyes — showcase your talent.'],
            ['Business Card at Cashier', 'Place your order hotline and email on every box. Custom cake orders are high-margin — capture these leads.']
        ],
        digital_marketing: [
            ['Instagram Pastry Photos', 'Flat-lay and overhead shots of cakes and pastries. Consistent filter/aesthetic. Use #PastryPH #CustomCakePH hashtags.'],
            ['Facebook Custom Cake Orders', 'Monthly promo post: "Custom Birthday Cake, order 3 days ahead. DM us!" Include price range and past examples.'],
            ['TikTok Cake Decorating', 'Time-lapse or real-time cake decoration videos. These consistently go viral on Filipino TikTok.'],
            ['Facebook Ads (Custom Cakes)', 'PHP 150/day targeting ages 20-45 within 7km. Event-based: "Order your graduation cake!" (April–May). "Christmas gifts!" (Nov-Dec).'],
            ['Shopee / Lazada Shop', 'List pre-packaged products (cookies, ensaymada) for delivery. Low-MOQ packaging makes this possible for bakers.'],
            ['WhatsApp Order System', 'Accept cake orders via WhatsApp with a printed price list + catalog. Confirm order with 50% downpayment.']
        ]
    },

    clothing: {
        label: 'Clothing / Boutique',
        mgmt_checklist: [
            'Check store layout and display for cleanliness and appeal',
            'Restock display items from stockroom based on gaps',
            'Tag all new arrivals with price and size before display',
            'Check fitting room cleanliness and mirror condition',
            'Review slow-moving items for markdown decisions',
            'Track daily sales count and best-selling items',
            'Secure cash in safe/designated area at day end',
            'Update stock log for items sold and items received'
        ],
        swot: {
            strengths: ['Curated selection tailored to local taste and size range', 'Personal styling service that online shops cannot provide', 'Touch-and-feel experience before purchase', 'Flexible credit or installment for loyal customers', 'Ability to source trending styles quickly from Taytay/Divisoria', 'No MOQ pressure unlike franchise stores'],
            weaknesses: ['Seasonal fashion changes create unsold inventory risk', 'Strong competition from online shops (Lazada, Shopee)', 'High initial capital for diverse size and style inventory', 'Small store limits display capacity', 'No brand recognition vs. established names', 'Returns and alteration costs add up'],
            opportunities: ['Ukay-ukay (vintage/secondhand) segment is growing fast', 'Online selling on Shopee/Lazada/TikTok Shop', 'Corporate uniform supply (schools, offices, BPO)', 'Alteration & tailoring service as premium add-on', 'Instagram fashion influencer tie-up', 'Pre-order model reduces inventory risk'],
            threats: ['Lazada, Shopee, Temu massive price undercutting', 'Fast fashion brands opening mall stores', 'Economic downturn reduces discretionary spending', 'Theft and inventory shrinkage', 'Counterfeit or duplicate designs flooding market', 'Supply chain delays from Taytay/Divisoria']
        },
        fifo_examples: [
            ['Seasonal clothing (summer/rainy season)', 'Rotate seasonal items out before off-season. Mark down 30% to clear before next season arrives.'],
            ['New arrivals vs. old stock', 'Hang new arrivals with "NEW" tag. Push older stock to prominent display before it becomes "last season."'],
            ['Sale rack rotation', 'Items on sale rack for 30+ days: further discount or donate. Avoid cluttered sale racks that discourage browsing.'],
            ['Size tracking', 'Track sold-out sizes immediately. Fastest-moving sizes (S, M, L) should be reordered when down to last 2 pieces.'],
            ['Accessories & accessories', 'Rotate jewelry and accessories display every 2 weeks. New position = new impulse purchases.']
        ],
        top_risks: [
            ['High', 'Medium', 'Slow sales on specific sizes or styles', 'Flexible markdowns; sell via Shopee if store slow; bundle deals'],
            ['Medium', 'High', 'End-of-season inventory becoming obsolete', 'Conservative buying (smaller first orders); reorder proven styles only'],
            ['High', 'Medium', 'Online competition (Temu, Shein) on price', 'Compete on experience, fit, and exclusivity — not price matching'],
            ['Medium', 'High', 'Theft (shoplifting + employee pilferage)', 'Security tags; visible CCTV; audit inventory weekly'],
            ['Medium', 'Medium', 'Fashion trend miss (bought wrong styles)', 'Order small quantities to test trends; scale only proven sellers'],
            ['Low', 'High', 'Supplier quality issue (defective items)', 'Inspect all deliveries before accepting; document defect rate by supplier'],
            ['Medium', 'Medium', 'Low foot traffic in chosen location', 'Online sales channel as backup; active social media to drive visits'],
            ['Low', 'Medium', 'Fire or flood damaging inventory', 'Business owner\'s insurance policy; keep receipts for insurance claims']
        ],
        startup_items: [
            ['Store fixtures, racks, hangers', 15000],
            ['Initial clothing inventory (50-100 pcs mixed)', 40000],
            ['Fitting room construction', 5000],
            ['POS & cash register system', 4000],
            ['Mannequins (3-5 pcs)', 5000],
            ['Business permits & BIR reg.', 3500],
            ['Signage & store branding', 5000],
            ['Packaging (bags, tissue paper)', 2000]
        ],
        monthly_costs: [
            ['Rent', 12000],
            ['Utilities', 2000],
            ['Stock restocking budget', 25000],
            ['Staff (1 sales associate)', 9000],
            ['Packaging & supplies', 1000],
            ['Shopee/Lazada commissions', 2000]
        ],
        margin_pct: 45,
        trad_marketing: [
            ['Window Display', 'Change window mannequin display every 2 weeks. A compelling display brings in walk-in traffic.'],
            ['Fashion Show / Pop-Up Event', 'Once per quarter, organize a small fashion show or pop-up sale in your barangay hall or community area.'],
            ['School & Office Uniform Supply', 'Approach nearby schools and offices for bulk uniform orders. One deal can equal 3 months of walk-in sales.'],
            ['Flyers in Malls / Tiangge', 'Distribute flyers in nearby tiangge events or weekend markets. Include QR code to your Facebook page.'],
            ['Referral Discount', '"Refer a friend, get PHP 100 off your next purchase." Creates word-of-mouth chain among friend groups.'],
            ['VIP Card', 'Loyalty card: 10% discount for purchases over PHP 5,000. Tracks big spenders and creates belonging.']
        ],
        digital_marketing: [
            ['Shopee / Lazada Store', 'Open free online store. List your top 30 products with clear photos (white background), size chart, and details.'],
            ['TikTok Shop', 'TikTok Shop is the fastest-growing platform for fashion in PH. Create 30-second try-on videos and link to TikTok Shop.'],
            ['Instagram Fashion Posts', 'Post outfit photos daily. Use lifestyle images (model wearing the item, not just hanger). Use #OOTDPhilippines hashtag.'],
            ['Facebook Live Selling', 'Go live on Facebook every Thursday and Sunday evening. Show items, demonstrate fit, accept orders via comment.'],
            ['Pinterest Board', 'Create a Pinterest board of your style inspiration and product catalog. Drives Google image search traffic.'],
            ['Influencer Partnership', 'Partner with micro-influencer (5,000–50,000 followers) in your city. Send 2-3 items in exchange for posts/reels.']
        ]
    },

    other: {
        label: 'Business',
        mgmt_checklist: [
            'Open facility and prepare workspace for the day\'s operations',
            'Verify all equipment and tools are functional and ready',
            'Review schedule, bookings, or pending orders for the day',
            'Check inventory/supplies and note items to reorder',
            'Brief staff on daily priorities and customer expectations',
            'Monitor quality of service/product throughout the day',
            'Reconcile sales/revenue at end of day',
            'Document any operational issues for review and action'
        ],
        swot: {
            strengths: ['Deep knowledge and passion for your chosen business', 'Personal service quality that large businesses cannot match', 'Flexibility to adapt quickly to customer feedback', 'Low overhead compared to corporate competitors', 'Community trust and local reputation advantage', 'Direct owner involvement ensures quality control'],
            weaknesses: ['Limited initial brand recognition in market', 'Owner dependence — business may slow without owner present', 'Limited capital for marketing and expansion', 'Smaller scale limits negotiating power with suppliers', 'No formal systems in early stage', 'Limited network of referral sources at launch'],
            opportunities: ['Underserved demand in your local community', 'Online channels open access to wider market', 'Government SME support programs (DTI, DOST, SSS)', 'Partnership with complementary local businesses', 'Seasonal demand spikes in your category', 'Social media allows low-cost brand building'],
            threats: ['Established competitors with more capital and brand recognition', 'Economic slowdowns reducing discretionary spending', 'Rising operating costs (rent, utilities, supplies)', 'Changes in technology or consumer behavior in your industry', 'Regulatory changes affecting your business category', 'Difficulty retaining skilled staff at small business wages']
        },
        fifo_examples: [
            ['Consumable supplies', 'Always use oldest stock first. Label deliveries with date. Newer deliveries go behind older stock.'],
            ['Raw materials', 'Rotate materials by delivery date. First delivered should be first used in production.'],
            ['Finished goods', 'Products produced first should be sold or delivered first. Use production date labels.'],
            ['Perishable items', 'If applicable, conduct daily freshness checks. Never sell or use expired materials.'],
            ['Seasonal inventory', 'Track slow-moving seasonal items. Clear before season ends through promotions or bundle deals.']
        ],
        top_risks: [
            ['High', 'High', 'Insufficient initial sales volume', 'Aggressive opening promotions; build referral network; leverage social media'],
            ['Medium', 'High', 'Cash flow gap in first 3 months', 'Maintain 3-month operating reserve; track cash weekly not monthly'],
            ['Medium', 'High', 'Key person dependency (owner)', 'Document all processes; train backup; build systems not just skills'],
            ['Medium', 'Medium', 'Competitor response to your entry', 'Differentiate clearly; focus on niche; build customer loyalty fast'],
            ['Low', 'High', 'Equipment or facility failure', 'Regular maintenance; budget for repairs; know service providers'],
            ['Medium', 'Medium', 'Rising supply or operating costs', 'Review costs monthly; negotiate supplier contracts; find alternatives'],
            ['Low', 'High', 'Legal or regulatory compliance issue', 'Register properly; stay updated on permits; consult DTI or lawyer'],
            ['Medium', 'Medium', 'Customer dissatisfaction or complaint', 'Build feedback system; resolve complaints within 24 hours']
        ],
        startup_items: [
            ['Equipment & tools', 20000],
            ['Initial inventory/supplies', 15000],
            ['Business permits & registration', 4000],
            ['Signage & branding materials', 3000],
            ['Working capital reserve', 10000],
            ['Furniture & fixtures', 5000]
        ],
        monthly_costs: [
            ['Rent', 6000],
            ['Utilities', 2000],
            ['Supplies & materials', 15000],
            ['Marketing & promotion', 2000],
            ['Miscellaneous', 1500]
        ],
        margin_pct: 35,
        trad_marketing: [
            ['Business Signage', 'Visible storefront sign or banner is essential. Include name, service, phone number, and hours.'],
            ['Flyer Distribution', 'Distribute 200 flyers in your target area in opening week. Include special opening offer.'],
            ['Business Cards', 'Always carry business cards. Hand to every contact, customer, and referral.'],
            ['Community Involvement', 'Sponsor or participate in local barangay events. Builds trust and visibility in your community.'],
            ['Referral Program', 'Give existing customers a reason to refer. Even a small incentive creates word-of-mouth chain.'],
            ['Grand Opening Event', 'First week special: discount, freebies, or demo. Create a memorable first impression.']
        ],
        digital_marketing: [
            ['Facebook Business Page', 'Create your business page. Post 3x per week: products, customer testimonials, behind-the-scenes.'],
            ['Google My Business', 'Free local search listing. Add address, hours, photos. Essential for "near me" searches.'],
            ['WhatsApp Business', 'Professional communication channel for inquiries, orders, and customer service.'],
            ['Facebook Ads (Local)', 'PHP 50-100/day targeting your local area. Drive awareness and website/page visits.'],
            ['Join Local FB Groups', 'Post in local community groups (with permission). Share what your business offers.'],
            ['Instagram Presence', 'Visual businesses especially benefit from Instagram. Post quality photos consistently.']
        ]
    }
};

// Get content by business type with fallback to 'other'
function getBTContent(bt) {
    return BT_CONTENT[bt] || BT_CONTENT.other;
}

// ─── Blueprint HTML Generator ────────────────────────────────────────────────

var LANG_LABELS = {
    en:  { title:'Business Blueprint', by:'Prepared for', capital:'Starting Capital', location:'Location', date:'Date', bundle:'Bundle' },
    fil: { title:'Plano sa Negosyo', by:'Inihanda para kay', capital:'Panimulang Kapital', location:'Lokasyon', date:'Petsa', bundle:'Pakete' },
    ceb: { title:'Plano sa Negosyo', by:'Giandam alang sa', capital:'Sugod nga Kapital', location:'Lokasyon', date:'Petsa', bundle:'Pakete' },
    ar:  { title:'خطة العمل', by:'أُعدَّ لـ', capital:'رأس المال الابتدائي', location:'الموقع', date:'التاريخ', bundle:'الحزمة' },
    zh:  { title:'商业计划书', by:'为以下人员准备', capital:'启动资金', location:'地点', date:'日期', bundle:'套餐' },
    es:  { title:'Plan de Negocios', by:'Preparado para', capital:'Capital Inicial', location:'Ubicación', date:'Fecha', bundle:'Paquete' },
};

function generateBlueprintHTML(productName, customization, langCode) {
    const lang = LANG_LABELS[langCode] || LANG_LABELS['en'];
    const bt = customization && customization.businessType ? customization.businessType : 'other';
    const btLabel = customization && customization.businessTypeLabel ? customization.businessTypeLabel : 'Your Business';
    const capital = customization && customization.capital ? Number(customization.capital) : 0;
    const loc = customization && customization.location ? customization.location : {};
    const suppliers = customization && customization.suppliers ? customization.suppliers : [];
    const description = customization && customization.description ? customization.description : '';
    const content = getBTContent(bt);

    const pn = productName.toLowerCase();
    let tier = 'starter', tierLabel = 'Foundation', tierColor = '#E8420A';
    if (pn.includes('founder'))  { tier = 'founder';  tierLabel = 'Advanced';    tierColor = '#6366F1'; }
    if (pn.includes('complete')) { tier = 'complete'; tierLabel = 'Pro — Complete'; tierColor = '#10B981'; }
    if (pn.includes('custom'))   { tier = 'custom';   tierLabel = 'Custom Pro';   tierColor = '#F5A500'; }

    const locationStr = [loc.subdivision, loc.city, loc.region, loc.country].filter(Boolean).join(', ') || 'Philippines';
    const dateStr = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });

    // Financial estimates
    const startupItems = content.startup_items || [['Initial setup', 30000]];
    const totalStartup = startupItems.reduce((s, i) => s + i[1], 0);
    const monthlyCosts = content.monthly_costs || [['Operations', 15000]];
    const totalMonthly = monthlyCosts.reduce((s, i) => s + i[1], 0);
    const marginPct = content.margin_pct || 30;
    const breakeven = Math.ceil(totalMonthly / (marginPct / 100));
    const dailyTarget = Math.ceil(breakeven / 26);

    // Capital usage note
    let capitalNote = '';
    if (capital > 0) {
        const surplus = capital - totalStartup;
        capitalNote = surplus >= 0
            ? `Your capital of PHP ${capital.toLocaleString()} covers estimated startup costs (PHP ${totalStartup.toLocaleString()}) with PHP ${surplus.toLocaleString()} as reserve.`
            : `Your capital of PHP ${capital.toLocaleString()} is PHP ${Math.abs(surplus).toLocaleString()} below the estimated startup cost. Consider scaling down the initial setup or securing additional funding.`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${productName} — ${btLabel} Blueprint | Negosyo Plan</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Arial,sans-serif;color:#0F1F3D;background:#FFF8F2;line-height:1.7;}
.cover{background:linear-gradient(135deg,#0F1F3D 60%,#1B3260);min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:4rem 3rem;color:#fff;page-break-after:always;}
.cover-badge{display:inline-block;background:#E8420A;color:#fff;font-size:0.75rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;padding:0.4rem 1rem;border-radius:999px;margin-bottom:1.5rem;}
.cover h1{font-size:2.6rem;font-weight:900;line-height:1.15;margin-bottom:0.75rem;}
.cover h1 span{color:#F5A500;}
.cover-sub{font-size:1.05rem;color:rgba(255,255,255,0.72);margin-bottom:2rem;max-width:540px;}
.cover-meta{display:flex;flex-wrap:wrap;gap:1.5rem;margin-top:2rem;}
.cover-meta-item{font-size:0.82rem;color:rgba(255,255,255,0.65);}
.cover-meta-item strong{display:block;color:#F5A500;font-size:0.95rem;font-weight:700;}
.cover-tier{display:inline-block;padding:0.5rem 1.4rem;border:2px solid ${tierColor};color:${tierColor};border-radius:999px;font-size:0.9rem;font-weight:700;margin-top:2rem;}
.toc{max-width:820px;margin:0 auto;padding:3rem 2rem;page-break-after:always;}
.toc h2{font-size:1.5rem;color:#0F1F3D;margin-bottom:1.5rem;padding-bottom:0.5rem;border-bottom:3px solid #E8420A;}
.toc-item{display:flex;justify-content:space-between;padding:0.55rem 0;border-bottom:1px dotted #ddd;font-size:0.9rem;}
.toc-item a{color:#0F1F3D;text-decoration:none;font-weight:600;}
.toc-item span{color:#E8420A;font-weight:700;}
.doc{max-width:820px;margin:0 auto;padding:2rem 2rem;}
.section{margin-bottom:3rem;page-break-inside:avoid;}
.section-hdr{display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:2px solid;}
.section-hdr h2{font-size:1.3rem;font-weight:900;}
.section-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;color:#fff;}
h3{font-size:1rem;font-weight:800;color:#0F1F3D;margin:1.25rem 0 0.6rem;}
p{margin-bottom:0.75rem;font-size:0.9rem;}
.info-box{background:rgba(232,66,10,0.06);border-left:4px solid #E8420A;padding:0.9rem 1.1rem;border-radius:0 8px 8px 0;margin:1rem 0;font-size:0.88rem;}
.info-box strong{color:#E8420A;}
.checklist{list-style:none;padding:0;}
.checklist li{padding:0.4rem 0;display:flex;gap:0.6rem;font-size:0.88rem;border-bottom:1px solid #f0ede9;}
.checklist li::before{content:"☐";color:#E8420A;font-size:1rem;flex-shrink:0;margin-top:0.05rem;}
.checklist li.done::before{content:"✓";color:#10B981;}
table{width:100%;border-collapse:collapse;font-size:0.85rem;margin:1rem 0;}
th{background:#0F1F3D;color:#fff;padding:0.7rem 0.9rem;text-align:left;}
td{padding:0.65rem 0.9rem;border-bottom:1px solid #e8e4df;}
tr:nth-child(even) td{background:#faf8f5;}
.swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;}
.swot-box{border-radius:10px;padding:1rem 1.1rem;}
.swot-s{background:rgba(16,185,129,0.08);border:1.5px solid #10B981;}
.swot-w{background:rgba(239,68,68,0.06);border:1.5px solid #EF4444;}
.swot-o{background:rgba(99,102,241,0.07);border:1.5px solid #6366F1;}
.swot-t{background:rgba(245,158,11,0.07);border:1.5px solid #F59E0B;}
.swot-box h4{font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.6rem;}
.swot-s h4{color:#10B981;} .swot-w h4{color:#EF4444;} .swot-o h4{color:#6366F1;} .swot-t h4{color:#D97706;}
.swot-box ul{padding-left:1rem;font-size:0.82rem;}
.swot-box ul li{margin-bottom:0.3rem;}
.risk-high{background:#FEF2F2;color:#DC2626;font-weight:700;padding:0.2rem 0.5rem;border-radius:4px;}
.risk-medium{background:#FFFBEB;color:#D97706;font-weight:700;padding:0.2rem 0.5rem;border-radius:4px;}
.risk-low{background:#F0FDF4;color:#16A34A;font-weight:700;padding:0.2rem 0.5rem;border-radius:4px;}
.fin-row{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #eee;font-size:0.88rem;}
.fin-total{display:flex;justify-content:space-between;padding:0.75rem 0;border-top:2px solid #E8420A;font-weight:800;font-size:0.95rem;color:#E8420A;}
.strategy-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;}
.strategy-card{border:1.5px solid #e8e4df;border-radius:10px;padding:0.9rem 1rem;}
.strategy-card h4{font-size:0.82rem;font-weight:800;color:#0F1F3D;margin-bottom:0.4rem;}
.strategy-card ul{padding-left:1rem;font-size:0.8rem;color:#555;}
.strategy-card ul li{margin-bottom:0.25rem;}
.mkt-block{border:1.5px solid #e8e4df;border-radius:10px;padding:1rem;margin-bottom:0.75rem;}
.mkt-block h4{font-size:0.85rem;font-weight:800;color:#E8420A;margin-bottom:0.35rem;}
.mkt-block p{font-size:0.82rem;color:#555;margin:0;}
.timeline-item{display:flex;gap:1rem;padding:0.75rem 0;border-bottom:1px solid #eee;align-items:flex-start;}
.timeline-dot{width:32px;height:32px;border-radius:50%;background:#E8420A;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;flex-shrink:0;}
.timeline-content h4{font-size:0.88rem;font-weight:700;color:#0F1F3D;margin-bottom:0.2rem;}
.timeline-content p{font-size:0.8rem;color:#666;margin:0;}
.supplier-card{border:1.5px solid #e8e4df;border-radius:10px;padding:0.9rem 1rem;margin-bottom:0.65rem;}
.supplier-card h4{font-size:0.86rem;font-weight:800;color:#0F1F3D;margin-bottom:0.2rem;}
.supplier-card p{font-size:0.8rem;color:#666;margin:0;}
.supplier-meta{font-size:0.75rem;color:#E8420A;font-weight:600;margin-top:0.3rem;}
.badge{display:inline-block;font-size:0.73rem;font-weight:700;padding:0.15rem 0.6rem;border-radius:999px;margin-right:0.3rem;}
.highlight{color:#E8420A;font-weight:700;}
footer.doc-footer{text-align:center;padding:2rem;background:#0F1F3D;color:rgba(255,255,255,0.6);font-size:0.78rem;margin-top:3rem;}
footer.doc-footer span{color:#F5A500;}
@media print{.cover{page-break-after:always;}.section{page-break-inside:avoid;}}
@media(max-width:600px){.swot-grid,.strategy-grid{grid-template-columns:1fr;}.cover{padding:2rem 1.5rem;}.doc{padding:1.5rem 1rem;}}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
    <span class="cover-badge">Negosyo Plan · Blueprint OS</span>
    <h1>${productName}<br><span>${btLabel}</span></h1>
    <p class="cover-sub">Your complete business management system — covering SWOT, FIFO, Risk Analysis, Financial Planning, Business Strategy, and Marketing Strategy (Traditional + Digital).</p>
    <div class="cover-meta">
        <div class="cover-meta-item"><strong>${lang.bundle}</strong>${tierLabel}</div>
        <div class="cover-meta-item"><strong>Business Type</strong>${btLabel}</div>
        <div class="cover-meta-item"><strong>${lang.location}</strong>${locationStr}</div>
        ${capital > 0 ? `<div class="cover-meta-item"><strong>${lang.capital}</strong>PHP ${capital.toLocaleString()}</div>` : ''}
        <div class="cover-meta-item"><strong>${lang.date}</strong>${dateStr}</div>
        <div class="cover-meta-item"><strong>Version</strong>2026 Edition</div>
    </div>
    <span class="cover-tier">${tierLabel} Tier</span>
    ${description ? `<div style="margin-top:1.5rem;padding:0.9rem 1.2rem;background:rgba(255,255,255,0.07);border-radius:10px;font-size:0.85rem;color:rgba(255,255,255,0.75);max-width:540px;"><strong style="color:#F5A500;">Your note:</strong> ${description}</div>` : ''}
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc">
    <h2>Table of Contents</h2>
    ${[
        ['1. Management System', '03'],
        ['2. SWOT Analysis', '04'],
        ['3. FIFO Inventory System', '05'],
        ['4. Risk Analysis', '06'],
        ['5. Financial Analysis', '07'],
        ['6. Business Strategy', '09'],
        ['7. Traditional Marketing Strategy', '10'],
        ['8. Digital Marketing Strategy', '11'],
        ['9. Implementation Timeline', '12'],
        ['10. Supplier Directory', '13']
    ].map(([title, pg]) => `<div class="toc-item"><a href="#">${title}</a><span>${pg}</span></div>`).join('')}
</div>

<div class="doc">

<!-- SECTION 1: MANAGEMENT SYSTEM -->
<div class="section" id="mgmt">
    <div class="section-hdr" style="border-color:#E8420A;">
        <div class="section-icon" style="background:#E8420A;">⚙</div>
        <div>
            <h2 style="color:#E8420A;">1. Management System</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Daily operations, staff management & KPI tracking</p>
        </div>
    </div>

    <div class="info-box">
        <strong>Why this matters:</strong> A consistent management system is what separates businesses that survive from those that fail in Year 1. Document everything so your business can operate even without you present.
    </div>

    <h3>Business Operations Overview</h3>
    <p>Your <strong>${btLabel}</strong> business should operate using the following daily system. This ensures quality, reduces waste, prevents losses, and provides a consistent experience for every customer.</p>

    <h3>Daily Operations Checklist</h3>
    <ul class="checklist">
        ${content.mgmt_checklist.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <h3>Key Performance Indicators (KPIs)</h3>
    <table>
        <tr><th>KPI</th><th>Target (Monthly)</th><th>Measurement Method</th></tr>
        <tr><td>Monthly Revenue</td><td>PHP ${breakeven.toLocaleString()}+</td><td>Daily sales log / POS</td></tr>
        <tr><td>Daily Transaction Count</td><td>${dailyTarget} customers+</td><td>Receipt count / POS</td></tr>
        <tr><td>Gross Margin</td><td>${marginPct}%+</td><td>(Revenue − COGS) ÷ Revenue</td></tr>
        <tr><td>Stock Turnover Rate</td><td>4× per month</td><td>Units sold ÷ Avg inventory on hand</td></tr>
        <tr><td>Customer Retention Rate</td><td>60%+ returning</td><td>Loyalty card / customer log</td></tr>
        ${tier !== 'starter' ? `<tr><td>Net Profit Margin</td><td>15%+ after all expenses</td><td>Monthly income statement review</td></tr>` : ''}
    </table>

    <h3>Staff Roles & Responsibilities</h3>
    <table>
        <tr><th>Role</th><th>Primary Responsibilities</th><th>Reporting To</th></tr>
        <tr><td>Owner / Manager</td><td>Overall operations, purchasing, supplier relations, daily P&L review, strategy decisions</td><td>Self</td></tr>
        <tr><td>Sales / Counter Staff</td><td>Customer service, point-of-sale transactions, product display, cleanliness</td><td>Owner</td></tr>
        <tr><td>Inventory / Stockroom</td><td>Receiving deliveries, FIFO rotation, stock counting, expiry monitoring</td><td>Owner</td></tr>
        ${tier !== 'starter' ? `<tr><td>Delivery / Runner (if applicable)</td><td>Customer deliveries, supplier pickups, errand execution</td><td>Owner</td></tr>` : ''}
    </table>

    ${tier === 'founder' || tier === 'complete' || tier === 'custom' ? `
    <h3>Standard Operating Procedures (SOPs)</h3>
    <p>The following SOPs should be documented in a laminated quick-reference card posted at each workstation:</p>
    <ul class="checklist">
        <li>SOP-01: Customer Greeting & Service Standard</li>
        <li>SOP-02: Cash Handling & Discrepancy Procedure</li>
        <li>SOP-03: Stock Receiving & FIFO Rotation</li>
        <li>SOP-04: Equipment Maintenance & Reporting</li>
        <li>SOP-05: Customer Complaint Resolution</li>
    </ul>` : ''}
</div>

<!-- SECTION 2: SWOT ANALYSIS -->
<div class="section" id="swot">
    <div class="section-hdr" style="border-color:#6366F1;">
        <div class="section-icon" style="background:#6366F1;">◈</div>
        <div>
            <h2 style="color:#6366F1;">2. SWOT Analysis</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Strengths, Weaknesses, Opportunities, Threats</p>
        </div>
    </div>

    <div class="info-box">
        <strong>How to use your SWOT:</strong> Use Strengths to capture Opportunities. Address Weaknesses before Threats exploit them. Review and update this SWOT every 90 days as your business evolves.
    </div>

    <h3>SWOT Matrix — ${btLabel}</h3>
    <div class="swot-grid">
        <div class="swot-box swot-s">
            <h4>💪 Strengths (Internal, Positive)</h4>
            <ul>${content.swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="swot-box swot-w">
            <h4>⚠️ Weaknesses (Internal, Negative)</h4>
            <ul>${content.swot.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="swot-box swot-o">
            <h4>🚀 Opportunities (External, Positive)</h4>
            <ul>${content.swot.opportunities.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="swot-box swot-t">
            <h4>⚡ Threats (External, Negative)</h4>
            <ul>${content.swot.threats.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
    </div>

    <h3>SWOT-to-Action Plan</h3>
    <table>
        <tr><th>Strategy Type</th><th>Logic</th><th>Example Action for Your Business</th></tr>
        <tr><td><strong>SO Strategy</strong></td><td>Use Strengths to seize Opportunities</td><td>Leverage community trust (S) to launch GCash payments (O)</td></tr>
        <tr><td><strong>WO Strategy</strong></td><td>Overcome Weaknesses using Opportunities</td><td>Use GrabFood listing (O) to compensate for limited seating (W)</td></tr>
        <tr><td><strong>ST Strategy</strong></td><td>Use Strengths to counter Threats</td><td>Use personal relationships (S) to retain customers despite new competition (T)</td></tr>
        <tr><td><strong>WT Strategy</strong></td><td>Minimize Weaknesses, avoid Threats</td><td>Build cash reserve (reduce W: cash flow) before rainy season (T)</td></tr>
    </table>

    ${tier === 'complete' || tier === 'custom' ? `
    <h3>PESTEL Environment Scan</h3>
    <table>
        <tr><th>Factor</th><th>Impact on Your Business</th><th>Action Required</th></tr>
        <tr><td>Political</td><td>LGU business permits, barangay ordinances, national policies (e.g., MSME Act, Go-Negosyo)</td><td>Maintain compliance; engage barangay officials</td></tr>
        <tr><td>Economic</td><td>OFW remittances driving consumer spending; inflation affecting operating costs</td><td>Flexible pricing strategy; monitor NSCB inflation data</td></tr>
        <tr><td>Social</td><td>Filipino preference for local, affordable goods; community trust in suki (loyal customer) system</td><td>Build community relationships; respect local culture</td></tr>
        <tr><td>Technological</td><td>Digital payments (GCash, Maya) widely adopted; social commerce (Facebook, TikTok) growing fast</td><td>Accept digital payments; maintain active social media presence</td></tr>
        <tr><td>Environmental</td><td>Plastic bag regulations; single-use packaging restrictions; typhoon season disruptions</td><td>Shift to eco-bags; build contingency for supply disruption</td></tr>
        <tr><td>Legal</td><td>DTI registration, BIR registration, barangay clearance, sanitary permits required</td><td>Complete all registrations before opening; renew annually</td></tr>
    </table>` : ''}
</div>

<!-- SECTION 3: FIFO INVENTORY SYSTEM -->
<div class="section" id="fifo">
    <div class="section-hdr" style="border-color:#F5A500;">
        <div class="section-icon" style="background:#F5A500;">📦</div>
        <div>
            <h2 style="color:#D97706;">3. FIFO Inventory System</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">First-In, First-Out stock management</p>
        </div>
    </div>

    <div class="info-box">
        <strong>FIFO Principle:</strong> The product you received FIRST must be SOLD or USED FIRST. This prevents expiry losses, maintains product quality, and reduces waste — directly protecting your profits.
    </div>

    <h3>Why FIFO is Critical for Your Business</h3>
    <p>For a <strong>${btLabel}</strong>, proper inventory rotation can save PHP 2,000–8,000 per month in prevented waste and expiry losses. Without FIFO, slow-moving items accumulate at the back while new stock sells, leading to costly write-offs.</p>

    <h3>FIFO Implementation by Product Category</h3>
    <table>
        <tr><th>Product / Category</th><th>FIFO Rule for Your Business</th></tr>
        ${content.fifo_examples.map(([item, rule]) => `<tr><td><strong>${item}</strong></td><td>${rule}</td></tr>`).join('')}
    </table>

    <h3>Stock Tracking Worksheet (Weekly)</h3>
    <table>
        <tr><th>Item Name</th><th>Opening Stock</th><th>Received</th><th>Sold/Used</th><th>Closing Stock</th><th>Reorder Level</th><th>Action</th></tr>
        <tr><td>[Item 1]</td><td>___</td><td>___</td><td>___</td><td>___</td><td>___</td><td>□ Reorder □ OK □ Monitor</td></tr>
        <tr><td>[Item 2]</td><td>___</td><td>___</td><td>___</td><td>___</td><td>___</td><td>□ Reorder □ OK □ Monitor</td></tr>
        <tr><td>[Item 3]</td><td>___</td><td>___</td><td>___</td><td>___</td><td>___</td><td>□ Reorder □ OK □ Monitor</td></tr>
        <tr><td>[Item 4]</td><td>___</td><td>___</td><td>___</td><td>___</td><td>___</td><td>□ Reorder □ OK □ Monitor</td></tr>
        <tr><td>[Item 5]</td><td>___</td><td>___</td><td>___</td><td>___</td><td>___</td><td>□ Reorder □ OK □ Monitor</td></tr>
    </table>

    <h3>Reorder Point Formula</h3>
    <div class="info-box">
        <strong>Reorder Point = (Average Daily Usage × Lead Time Days) + Safety Stock</strong><br><br>
        Example: If you sell 10 units/day, supplier takes 3 days to deliver, and you want 2 days of safety stock:<br>
        Reorder Point = (10 × 3) + (10 × 2) = <strong>50 units</strong> — order when stock hits 50.
    </div>

    ${tier !== 'starter' ? `
    <h3>ABC Inventory Classification</h3>
    <table>
        <tr><th>Class</th><th>Description</th><th>Action</th><th>% of Items</th></tr>
        <tr><td><span class="badge" style="background:#FEE2E2;color:#DC2626;">A — High Value</span></td><td>Top 10-20% items generating 70-80% of revenue</td><td>Monitor daily, maintain buffer stock, dual supplier</td><td>~20%</td></tr>
        <tr><td><span class="badge" style="background:#FEF3C7;color:#D97706;">B — Medium Value</span></td><td>Mid-range items with steady but moderate sales</td><td>Monitor weekly, standard reorder schedule</td><td>~30%</td></tr>
        <tr><td><span class="badge" style="background:#D1FAE5;color:#065F46;">C — Low Value</span></td><td>Slow-moving items with low individual revenue</td><td>Monthly check, consider discontinuing if no movement</td><td>~50%</td></tr>
    </table>` : ''}
</div>

<!-- SECTION 4: RISK ANALYSIS -->
<div class="section" id="risk">
    <div class="section-hdr" style="border-color:#EF4444;">
        <div class="section-icon" style="background:#EF4444;">🛡</div>
        <div>
            <h2 style="color:#DC2626;">4. Risk Analysis</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Risk identification, matrix & mitigation strategies</p>
        </div>
    </div>

    <h3>Risk Matrix Legend</h3>
    <table>
        <tr><th>Rating</th><th>Probability</th><th>Impact</th></tr>
        <tr><td><span class="risk-high">HIGH</span></td><td>Likely to happen (>60% chance)</td><td>Major loss or business disruption</td></tr>
        <tr><td><span class="risk-medium">MEDIUM</span></td><td>May happen (20–60% chance)</td><td>Moderate setback, manageable loss</td></tr>
        <tr><td><span class="risk-low">LOW</span></td><td>Unlikely (<20% chance)</td><td>Minor inconvenience, easily recovered</td></tr>
    </table>

    <h3>Top Risks for Your ${btLabel} Business</h3>
    <table>
        <tr><th>#</th><th>Risk</th><th>Probability</th><th>Impact</th><th>Mitigation Strategy</th></tr>
        ${content.top_risks.map(([prob, impact, risk, mitigation], i) => `
        <tr>
            <td style="font-weight:700;color:#0F1F3D;">${i + 1}</td>
            <td>${risk}</td>
            <td><span class="risk-${prob.toLowerCase()}">${prob}</span></td>
            <td><span class="risk-${impact.toLowerCase()}">${impact}</span></td>
            <td>${mitigation}</td>
        </tr>`).join('')}
    </table>

    <h3>Risk Response Strategies</h3>
    <div class="strategy-grid">
        <div class="strategy-card">
            <h4>🚫 Eliminate (High Prob + High Impact)</h4>
            <ul><li>Remove the root cause entirely</li><li>Don't start if risk cannot be mitigated</li><li>Change business model to avoid risk</li></ul>
        </div>
        <div class="strategy-card">
            <h4>⚙ Mitigate (Med/High — reduce it)</h4>
            <ul><li>Build systems to reduce likelihood</li><li>Maintain buffer stock, emergency fund</li><li>Train staff, document procedures</li></ul>
        </div>
        <div class="strategy-card">
            <h4>👁 Monitor (Low Prob — watch it)</h4>
            <ul><li>Review monthly; act only if worsening</li><li>Set early warning indicators</li><li>Have contingency plan ready but unused</li></ul>
        </div>
        <div class="strategy-card">
            <h4>✅ Accept (Low Prob + Low Impact)</h4>
            <ul><li>Cost of mitigation exceeds potential loss</li><li>Document and acknowledge the risk</li><li>No action unless situation changes</li></ul>
        </div>
    </div>

    <h3>Emergency Response Checklist</h3>
    <ul class="checklist">
        <li>Maintain 45-day operating expense cash reserve at all times</li>
        <li>Have at least 2 suppliers for your top 5 products</li>
        <li>Keep owner contact list for all staff, suppliers, and key customers</li>
        <li>Know the nearest DTI Negosyo Center for business support</li>
        <li>Keep all business documents in a secure, fireproof folder or cloud storage</li>
        ${tier !== 'starter' ? `<li>Maintain business insurance policy covering fire, theft, and liability</li><li>Review and update this risk register every 6 months</li>` : ''}
    </ul>
</div>

<!-- SECTION 5: FINANCIAL ANALYSIS -->
<div class="section" id="financial">
    <div class="section-hdr" style="border-color:#10B981;">
        <div class="section-icon" style="background:#10B981;">₱</div>
        <div>
            <h2 style="color:#059669;">5. Financial Analysis</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Startup costs, P&L projection, break-even & cash flow</p>
        </div>
    </div>

    ${capitalNote ? `<div class="info-box"><strong>Capital Assessment:</strong> ${capitalNote}</div>` : ''}

    <h3>Estimated Startup Cost Breakdown</h3>
    ${startupItems.map(([item, cost]) => `<div class="fin-row"><span>${item}</span><span>PHP ${cost.toLocaleString()}</span></div>`).join('')}
    <div class="fin-total"><span>Total Estimated Startup</span><span>PHP ${totalStartup.toLocaleString()}</span></div>

    <h3>Estimated Monthly Operating Costs</h3>
    ${monthlyCosts.map(([item, cost]) => `<div class="fin-row"><span>${item}</span><span>PHP ${cost.toLocaleString()}</span></div>`).join('')}
    <div class="fin-total"><span>Total Monthly Fixed + Variable</span><span>PHP ${totalMonthly.toLocaleString()}</span></div>

    <h3>Break-Even Analysis</h3>
    <div class="info-box">
        <strong>Gross Margin Rate:</strong> ${marginPct}% &nbsp;|&nbsp;
        <strong>Monthly Break-Even Sales:</strong> PHP ${breakeven.toLocaleString()} &nbsp;|&nbsp;
        <strong>Daily Sales Target:</strong> PHP ${dailyTarget.toLocaleString()} (26 working days/month)
    </div>

    <h3>6-Month Revenue Projection</h3>
    <table>
        <tr><th>Month</th><th>Projected Sales</th><th>Est. COGS (${100 - marginPct}%)</th><th>Gross Profit</th><th>Operating Costs</th><th>Net Profit / Loss</th></tr>
        ${[1,2,3,4,5,6].map(m => {
            const ramp = [0.5, 0.7, 0.85, 1.0, 1.1, 1.2][m-1];
            const sales = Math.round(breakeven * ramp / 1000) * 1000;
            const cogs = Math.round(sales * (1 - marginPct/100));
            const gross = sales - cogs;
            const net = gross - totalMonthly;
            return `<tr>
                <td>Month ${m}</td>
                <td>PHP ${sales.toLocaleString()}</td>
                <td>PHP ${cogs.toLocaleString()}</td>
                <td>PHP ${gross.toLocaleString()}</td>
                <td>PHP ${totalMonthly.toLocaleString()}</td>
                <td style="color:${net >= 0 ? '#059669' : '#DC2626'};font-weight:700;">PHP ${net.toLocaleString()}</td>
            </tr>`;
        }).join('')}
    </table>

    ${tier !== 'starter' ? `
    <h3>Key Financial Ratios to Track Monthly</h3>
    <table>
        <tr><th>Ratio</th><th>Formula</th><th>Target</th><th>Why It Matters</th></tr>
        <tr><td>Gross Margin</td><td>(Revenue − COGS) ÷ Revenue</td><td>${marginPct}%+</td><td>Shows if your pricing covers product costs</td></tr>
        <tr><td>Net Profit Margin</td><td>Net Profit ÷ Revenue</td><td>10–15%+</td><td>True profitability after all expenses</td></tr>
        <tr><td>Current Ratio</td><td>Current Assets ÷ Current Liabilities</td><td>1.5:1 or better</td><td>Ability to pay short-term debts</td></tr>
        <tr><td>Stock Turnover</td><td>COGS ÷ Average Inventory</td><td>4–8× per month</td><td>How fast you're selling your inventory</td></tr>
        <tr><td>Return on Investment</td><td>Net Profit ÷ Total Investment</td><td>20%+ annually</td><td>Whether your investment is worth keeping</td></tr>
    </table>` : ''}
</div>

<!-- SECTION 6: BUSINESS STRATEGY -->
<div class="section" id="strategy">
    <div class="section-hdr" style="border-color:#0F1F3D;">
        <div class="section-icon" style="background:#0F1F3D;">♟</div>
        <div>
            <h2 style="color:#0F1F3D;">6. Business Strategy</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Value proposition, pricing, competitive positioning & growth</p>
        </div>
    </div>

    <h3>Value Proposition Canvas</h3>
    <div class="strategy-grid">
        <div class="strategy-card">
            <h4>👤 Customer Profile</h4>
            <ul>
                <li><strong>Jobs:</strong> They want convenience, value, and reliability</li>
                <li><strong>Pains:</strong> Expensive options, bad service, wasted time</li>
                <li><strong>Gains:</strong> Save money, save time, feel taken care of</li>
            </ul>
        </div>
        <div class="strategy-card">
            <h4>💡 Your Value Map</h4>
            <ul>
                <li><strong>Products/Services:</strong> ${btLabel} offering</li>
                <li><strong>Pain Relievers:</strong> Competitive price, nearby location</li>
                <li><strong>Gain Creators:</strong> Quality, consistency, personal service</li>
            </ul>
        </div>
    </div>

    <h3>Pricing Strategy Options</h3>
    <table>
        <tr><th>Strategy</th><th>How It Works</th><th>Best For</th><th>Recommended?</th></tr>
        <tr><td>Cost-Plus Pricing</td><td>Add fixed % markup to your cost. e.g., cost PHP 10 + 25% = sell at PHP 12.50</td><td>Grocery, basic goods</td><td>✅ Start here</td></tr>
        <tr><td>Competitive Pricing</td><td>Match or slightly undercut competitor prices for the same items</td><td>Commodities, high competition areas</td><td>⚠️ Use selectively</td></tr>
        <tr><td>Value-Based Pricing</td><td>Price based on perceived value, not just cost. Premium feel = premium price.</td><td>Custom products, services</td><td>✅ For unique items</td></tr>
        <tr><td>Penetration Pricing</td><td>Start low to attract customers, then gradually raise to normal</td><td>New businesses, new products</td><td>✅ First 3 months</td></tr>
    </table>

    <h3>Competitive Advantage Framework</h3>
    <ul class="checklist">
        <li><strong>Price Advantage:</strong> Can you consistently offer better value for money than local competitors?</li>
        <li><strong>Location Advantage:</strong> Are you in the most convenient spot for your target customers?</li>
        <li><strong>Service Advantage:</strong> Do you offer faster, friendlier, or more personalized service?</li>
        <li><strong>Selection Advantage:</strong> Do you carry products competitors don't stock locally?</li>
        <li><strong>Loyalty Advantage:</strong> Do you have programs that make customers choose you by default?</li>
    </ul>

    ${tier === 'founder' || tier === 'complete' || tier === 'custom' ? `
    <h3>Porter's Five Forces — Your Industry</h3>
    <table>
        <tr><th>Force</th><th>Threat Level</th><th>What to Do</th></tr>
        <tr><td>Threat of New Entrants</td><td><span class="risk-high">HIGH</span> — low barriers to entry</td><td>Build customer loyalty fast before competitors arrive</td></tr>
        <tr><td>Bargaining Power of Suppliers</td><td><span class="risk-medium">MEDIUM</span></td><td>Use 2+ suppliers for key items; buy in bulk for better rates</td></tr>
        <tr><td>Bargaining Power of Buyers</td><td><span class="risk-medium">MEDIUM</span></td><td>Create switching costs via loyalty programs and credit</td></tr>
        <tr><td>Threat of Substitutes</td><td><span class="risk-high">HIGH</span> — alternative products exist</td><td>Differentiate on service and experience, not just product</td></tr>
        <tr><td>Industry Rivalry</td><td><span class="risk-high">HIGH</span> in most PH markets</td><td>Find your niche; serve a specific community better than anyone</td></tr>
    </table>` : ''}
</div>

<!-- SECTION 7: TRADITIONAL MARKETING -->
<div class="section" id="trad-mkt">
    <div class="section-hdr" style="border-color:#D97706;">
        <div class="section-icon" style="background:#D97706;">📣</div>
        <div>
            <h2 style="color:#D97706;">7. Traditional Marketing Strategy</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Offline advertising, community marketing & promotions</p>
        </div>
    </div>

    <div class="info-box">
        <strong>Traditional marketing still works in the Philippines.</strong> For hyperlocal businesses like yours, tarpaulin, flyers, word-of-mouth, and community presence are often more effective than digital ads — especially in Tiers 2 and 3 cities.
    </div>

    ${content.trad_marketing.map(([title, desc]) => `
    <div class="mkt-block">
        <h4>📌 ${title}</h4>
        <p>${desc}</p>
    </div>`).join('')}

    <h3>Monthly Traditional Marketing Budget Guide</h3>
    <table>
        <tr><th>Activity</th><th>Frequency</th><th>Est. Cost (PHP)</th><th>Expected Result</th></tr>
        <tr><td>Tarpaulin (4×8 ft)</td><td>One-time + quarterly update</td><td>500–800</td><td>Constant brand visibility; 50–200 impressions/day</td></tr>
        <tr><td>Flyers (100 pcs, A5)</td><td>Monthly</td><td>200–400</td><td>30–60 new customer inquiries per distribution</td></tr>
        <tr><td>Business cards (100 pcs)</td><td>Quarterly</td><td>200–350</td><td>B2B and referral leads over time</td></tr>
        <tr><td>Loyalty cards (50 pcs)</td><td>Monthly top-up</td><td>100–200</td><td>15–20% increase in repeat visits</td></tr>
        <tr><td>Opening promo (discounts)</td><td>First month only</td><td>PHP 1,000–3,000 equivalent</td><td>Initial customer base of 50–150 regulars</td></tr>
        <tr><td><strong>Total Monthly Budget</strong></td><td></td><td><strong>PHP 500–1,200</strong></td><td>Steady community awareness + loyalty</td></tr>
    </table>
</div>

<!-- SECTION 8: DIGITAL MARKETING -->
<div class="section" id="digital-mkt">
    <div class="section-hdr" style="border-color:#3B82F6;">
        <div class="section-icon" style="background:#3B82F6;">#</div>
        <div>
            <h2 style="color:#2563EB;">8. Digital Marketing Strategy</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Social media, paid ads, e-commerce & online presence</p>
        </div>
    </div>

    <div class="info-box">
        <strong>The Philippines has 86 million+ social media users</strong> — among the highest per capita globally. Your customers ARE online. A consistent digital presence is no longer optional for any business.
    </div>

    ${content.digital_marketing.map(([title, desc]) => `
    <div class="mkt-block" style="border-color:#DBEAFE;">
        <h4 style="color:#2563EB;">🔷 ${title}</h4>
        <p>${desc}</p>
    </div>`).join('')}

    <h3>Weekly Content Calendar Template</h3>
    <table>
        <tr><th>Day</th><th>Post Type</th><th>Content Idea</th><th>Goal</th></tr>
        <tr><td>Monday</td><td>Product highlight</td><td>New stocks / Featured item with price and photo</td><td>Drive purchases</td></tr>
        <tr><td>Tuesday</td><td>Educational / Tips</td><td>"Did you know?" fact about your business category</td><td>Build authority</td></tr>
        <tr><td>Wednesday</td><td>Mid-week promo</td><td>Special deal, discount, or bundle offer today only</td><td>Drive urgency</td></tr>
        <tr><td>Thursday</td><td>Customer feature</td><td>Photo or testimonial of a happy customer (with permission)</td><td>Build social proof</td></tr>
        <tr><td>Friday</td><td>Weekend preview</td><td>Weekend special or announcement of new arrivals</td><td>Drive weekend traffic</td></tr>
        <tr><td>Saturday</td><td>Behind the scenes</td><td>Preparation, restock, or "how it's made" content</td><td>Build connection</td></tr>
        <tr><td>Sunday</td><td>Community / Story</td><td>Local community post or personal business story</td><td>Build brand personality</td></tr>
    </table>

    <h3>Monthly Digital Marketing Budget</h3>
    <table>
        <tr><th>Channel</th><th>Monthly Budget</th><th>Expected Reach</th><th>Best For</th></tr>
        <tr><td>Facebook / Instagram Ads</td><td>PHP 1,500–3,000</td><td>5,000–20,000 local impressions</td><td>Brand awareness, store visits, messages</td></tr>
        <tr><td>Boosted Posts (2–3/month)</td><td>PHP 300–600</td><td>1,000–5,000 per post</td><td>Amplify best organic content</td></tr>
        <tr><td>TikTok Ads (optional)</td><td>PHP 500–1,000</td><td>10,000–50,000 views per ad</td><td>Younger audience, food & fashion</td></tr>
        <tr><td>Google Business (Free)</td><td>PHP 0</td><td>"Near me" searchers</td><td>Local discovery, directions</td></tr>
        <tr><td><strong>Recommended Total</strong></td><td><strong>PHP 2,000–5,000</strong></td><td><strong>15,000–75,000/month</strong></td><td>Combined multi-channel presence</td></tr>
    </table>
</div>

<!-- SECTION 9: IMPLEMENTATION TIMELINE -->
<div class="section" id="timeline">
    <div class="section-hdr" style="border-color:#8B5CF6;">
        <div class="section-icon" style="background:#8B5CF6;">📅</div>
        <div>
            <h2 style="color:#7C3AED;">9. Implementation Timeline</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Step-by-step business launch schedule</p>
        </div>
    </div>

    ${[
        ['PRE-LAUNCH (Weeks 1–2)', 'Complete DTI/BIR registration and all business permits. Finalize location and sign lease. Set up FIFO tracking system and stock templates.'],
        ['PRE-LAUNCH (Weeks 3–4)', 'Source and receive opening inventory from suppliers. Set up store/facility, install fixtures, signage. Hire and train staff on SOPs and daily checklist.'],
        ['LAUNCH (Month 1)', 'Grand opening with promo offer. Activate Facebook page, Google My Business, WhatsApp Business. Launch first Facebook ad campaign. Begin daily KPI tracking.'],
        ['GROWTH (Month 2)', 'Review Month 1 data. Identify top-selling and slow-moving items. Refine product mix. Start loyalty card program. Increase social media frequency.'],
        ['GROWTH (Month 3)', 'Break-even check. Adjust pricing or cost if needed. Expand product range based on customer feedback. Consider adding delivery service.'],
        ['SCALE (Months 4–6)', 'Aim for consistent monthly profitability. Build cash reserve. Evaluate opportunities: product expansion, second location, online store, or franchise model.']
    ].map(([phase, desc], i) => `
    <div class="timeline-item">
        <div class="timeline-dot">${i + 1}</div>
        <div class="timeline-content">
            <h4>${phase}</h4>
            <p>${desc}</p>
        </div>
    </div>`).join('')}

    <h3>90-Day Priority Checklist</h3>
    <ul class="checklist">
        <li>Complete all legal registrations (DTI, BIR, barangay clearance, sanitary permit)</li>
        <li>Open dedicated business bank account (separate from personal)</li>
        <li>Implement FIFO system from Day 1 — no exceptions</li>
        <li>Set up daily cash reconciliation habit</li>
        <li>Build Facebook Business page and post before opening day</li>
        <li>List on Google Maps / Google My Business</li>
        <li>Sign up with at least 2 reliable suppliers per product category</li>
        <li>Build 30-day operating expense reserve before opening</li>
        <li>Hire and document staff responsibilities — even if just 1 person</li>
        <li>Schedule 90-day review: Is the business on track? What needs adjusting?</li>
    </ul>
</div>

<!-- SECTION 10: SUPPLIER DIRECTORY -->
<div class="section" id="suppliers">
    <div class="section-hdr" style="border-color:#0F1F3D;">
        <div class="section-icon" style="background:#0F1F3D;">🚚</div>
        <div>
            <h2 style="color:#0F1F3D;">10. Supplier Directory</h2>
            <p style="font-size:0.8rem;color:#888;margin:0;">Your selected and recommended suppliers</p>
        </div>
    </div>

    ${suppliers.length > 0 ? `
    <h3>Your Selected Suppliers</h3>
    ${suppliers.map(s => `
    <div class="supplier-card">
        <h4>${s.name}</h4>
        <p>${s.contact || 'Contact details available upon request.'}</p>
        <div class="supplier-meta">
            <span class="badge" style="background:#FFF3EC;color:#E8420A;">${s.type || 'Supplier'}</span>
            <span class="badge" style="background:#F0FDF4;color:#059669;">${s.coverage || 'Philippines'}</span>
        </div>
    </div>`).join('')}
    <br>` : ''}

    <h3>Government Business Support Resources</h3>
    <div class="supplier-card">
        <h4>DTI Negosyo Center</h4>
        <p>Free business registration, mentoring, market access programs, and loans. Visit your nearest DTI provincial or city office.</p>
        <div class="supplier-meta"><span class="badge" style="background:#DBEAFE;color:#1D4ED8;">Government</span><span class="badge" style="background:#D1FAE5;color:#065F46;">Free Services</span></div>
    </div>
    <div class="supplier-card">
        <h4>DOST SETUP (Small Enterprise Technology Upgrading Program)</h4>
        <p>Up to PHP 500,000 in equipment grants for qualifying small businesses. Contact nearest DOST regional office.</p>
        <div class="supplier-meta"><span class="badge" style="background:#DBEAFE;color:#1D4ED8;">Government Grant</span><span class="badge" style="background:#D1FAE5;color:#065F46;">Free/Grant</span></div>
    </div>
    <div class="supplier-card">
        <h4>SB Corporation (Small Business Corporation)</h4>
        <p>Government-run financing for MSMEs. Loans from PHP 100,000 to PHP 5M at low interest rates. sbcorp.ph</p>
        <div class="supplier-meta"><span class="badge" style="background:#DBEAFE;color:#1D4ED8;">Government Loan</span><span class="badge" style="background:#FEF3C7;color:#D97706;">1–2% monthly interest</span></div>
    </div>

    <h3>Important Contacts</h3>
    <table>
        <tr><th>Resource</th><th>Contact / Website</th><th>What They Help With</th></tr>
        <tr><td>DTI ARTA (ease of business)</td><td>dtiracs.dti.gov.ph</td><td>Business permits, anti-red tape</td></tr>
        <tr><td>BIR Registration</td><td>bir.gov.ph | 981-8888</td><td>Tax registration, receipts, compliance</td></tr>
        <tr><td>Pag-IBIG Fund (MP2 Savings)</td><td>pagibigfund.gov.ph</td><td>Business owner savings and investment</td></tr>
        <tr><td>PhilHealth (self-employed)</td><td>philhealth.gov.ph</td><td>Health coverage for you and staff</td></tr>
        <tr><td>Negosyo Plan Support</td><td>support@negosyoplan.com | WhatsApp</td><td>Questions about this blueprint</td></tr>
    </table>
</div>

</div><!-- .doc -->

<footer class="doc-footer">
    <p><span>Negosyo Plan</span> &copy; 2026 | ${productName} · ${btLabel} Blueprint</p>
    <p style="margin-top:0.4rem;">Generated: ${dateStr} | support@negosyoplan.com | negosyoplan.com</p>
    <p style="margin-top:0.4rem;font-size:0.72rem;">This document is licensed for personal use only. Redistribution or reselling is prohibited.</p>
</footer>

</body>
</html>`;
}

// ─── Download Functions ────────────────────────────────────────────────────

var _downloadItems = {};

document.addEventListener('DOMContentLoaded', function() {
    loadPurchasedProducts();
    loadFreeDownloads();
});

function loadPurchasedProducts() {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const downloadList = document.getElementById('download-list');
    const noDownloads = document.getElementById('no-downloads');

    if (!downloadList) return;

    const items = [];
    purchases.forEach(purchase => {
        if (purchase.items) {
            purchase.items.forEach(item => {
                items.push({ ...item, purchaseDate: purchase.timestamp, orderId: purchase.id, token: purchase.token });
            });
        }
    });

    if (items.length === 0) {
        downloadList.style.display = 'none';
        if (noDownloads) noDownloads.style.display = 'flex';
        return;
    }

    if (noDownloads) noDownloads.style.display = 'none';
    downloadList.style.display = 'block';

    items.forEach((item, idx) => { _downloadItems['item_' + idx] = item; });

    downloadList.innerHTML = items.map((item, idx) => {
        const c = item.customization;
        const customBadge = c
            ? `<span style="display:inline-block;font-size:0.72rem;font-weight:700;padding:0.15rem 0.55rem;background:rgba(232,66,10,0.1);color:#E8420A;border-radius:999px;margin-top:0.3rem;">
                   ${c.businessTypeLabel || c.businessType}${c.location && c.location.city ? ' · ' + c.location.city : ''}
               </span>`
            : '';
        return `
        <div class="download-item-card">
            <img src="${item.image || ''}" alt="${item.name}" loading="lazy">
            <div style="flex:1;">
                <h4 style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:0.2rem;">${item.name}</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);"><i class="fas fa-calendar" style="margin-right:0.3rem;"></i>Purchased: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                <p style="font-size:0.78rem;color:var(--text-muted);">Qty: ${item.quantity} &nbsp;&bull;&nbsp; Order #${item.orderId}</p>
                ${customBadge}
            </div>
            <button type="button" class="button" onclick="downloadItemById('item_${idx}')">
                <i class="fas fa-download"></i> Download
            </button>
        </div>`;
    }).join('');
}

function loadFreeDownloads() {
    const container = document.getElementById('free-downloads');
    if (!container) return;
    container.innerHTML = FREE_RESOURCES.map(resource => `
        <div class="free-download-card">
            <div class="free-download-icon"><i class="${resource.icon}"></i></div>
            <div style="flex:1;">
                <h4 style="font-size:0.9rem;font-weight:700;color:var(--navy);margin-bottom:0.2rem;">${resource.title}</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">${resource.description}</p>
            </div>
            <button type="button" class="button secondary" style="flex-shrink:0;" onclick="downloadFreeResource('${escStr(resource.title)}')">
                <i class="fas fa-download"></i> Free
            </button>
        </div>
    `).join('');
}

function escStr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function downloadItemById(key) {
    const item = _downloadItems[key];
    if (!item) return;
    downloadProduct(item.name, item.customization || null);
}

/* ── Language selector languages ── */
var BLUEPRINT_LANGUAGES = [
    { code: 'en',  label: 'English',           flag: '🇺🇸' },
    { code: 'fil', label: 'Filipino (Tagalog)', flag: '🇵🇭' },
    { code: 'ceb', label: 'Cebuano',            flag: '🇵🇭' },
    { code: 'ar',  label: 'Arabic (العربية)',   flag: '🇦🇪' },
    { code: 'zh',  label: 'Chinese (中文)',     flag: '🇨🇳' },
    { code: 'es',  label: 'Spanish (Español)',  flag: '🇪🇸' },
];

function showLangModal(productName, customization) {
    var saved = localStorage.getItem('blueprintLang') || 'en';
    var existing = document.getElementById('lang-select-modal');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'lang-select-modal';
    overlay.className = 'lang-modal-overlay';
    overlay.innerHTML =
        '<div class="lang-modal" role="dialog" aria-modal="true" aria-labelledby="lang-modal-title">' +
          '<div class="lang-modal-head">' +
            '<div>' +
              '<h3 id="lang-modal-title"><i class="fas fa-language" style="color:var(--orange);margin-right:0.5rem;"></i>Select Blueprint Language</h3>' +
              '<p class="lang-modal-sub">Choose the language for your business blueprint document.</p>' +
            '</div>' +
            '<button class="lang-close" id="lang-close-btn" aria-label="Close">&times;</button>' +
          '</div>' +
          '<div class="lang-grid" id="lang-grid">' +
            BLUEPRINT_LANGUAGES.map(function (l) {
                return '<button type="button" class="lang-chip' + (l.code === saved ? ' selected' : '') + '" data-code="' + l.code + '">' +
                    '<span class="lang-flag">' + l.flag + '</span>' +
                    '<span class="lang-label">' + l.label + '</span>' +
                '</button>';
            }).join('') +
          '</div>' +
          '<div class="lang-modal-footer">' +
            '<button type="button" class="button" id="lang-confirm-btn"><i class="fas fa-download"></i> Download Blueprint</button>' +
            '<button type="button" class="button secondary" id="lang-cancel-btn">Cancel</button>' +
          '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    var selectedCode = saved;
    overlay.querySelectorAll('.lang-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            overlay.querySelectorAll('.lang-chip').forEach(function (c) { c.classList.remove('selected'); });
            chip.classList.add('selected');
            selectedCode = chip.getAttribute('data-code');
        });
    });

    function close() { var m = document.getElementById('lang-select-modal'); if (m) m.remove(); }

    document.getElementById('lang-close-btn').addEventListener('click', close);
    document.getElementById('lang-cancel-btn').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.getElementById('lang-confirm-btn').addEventListener('click', function () {
        localStorage.setItem('blueprintLang', selectedCode);
        close();
        _doDownload(productName, customization, selectedCode);
    });
}

function _doDownload(productName, customization, langCode) {
    var safeName = productName.replace(/\s+/g, '_').toLowerCase();
    var html = generateBlueprintHTML(productName, customization || null, langCode);

    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = safeName + '_blueprint_' + (langCode || 'en') + '.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.NegosyoPlan) window.NegosyoPlan.showToast(productName + ' blueprint downloaded!', 'success');
}

function downloadProduct(productName, customization) {
    showLangModal(productName, customization || null);
}

function downloadFreeResource(title) {
    showLangModal(title, null);
}

function loadAccountDownloads() {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const accountDownloads = document.getElementById('account-downloads');
    if (!accountDownloads) return;

    const items = [];
    purchases.forEach(purchase => {
        if (purchase.items) {
            purchase.items.forEach(item => items.push({ ...item, purchaseDate: purchase.timestamp }));
        }
    });

    if (items.length === 0) {
        accountDownloads.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No downloads yet. <a href="shop.html" style="color:var(--orange);font-weight:600;">Browse our bundles.</a></p>';
        return;
    }

    const _acct = {};
    items.forEach((item, idx) => { _acct['acct_' + idx] = item; });
    window._acctDownloads = _acct;

    accountDownloads.innerHTML = items.map((item, idx) => `
        <div class="download-btn-row">
            <div class="file-info">
                <h4>${item.name}</h4>
                <p>Purchased ${new Date(item.purchaseDate).toLocaleDateString()}${item.customization ? ' · ' + (item.customization.businessTypeLabel || item.customization.businessType) : ''}</p>
            </div>
            <button type="button" class="button" style="flex-shrink:0;" onclick="downloadProduct('${escStr(item.name)}', window._acctDownloads && window._acctDownloads['acct_${idx}'] && window._acctDownloads['acct_${idx}'].customization || null)">
                <i class="fas fa-download"></i>
            </button>
        </div>
    `).join('');
}
