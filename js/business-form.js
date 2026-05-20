// business-form.js - Business customization modal shown before adding to cart

(function () {
    'use strict';

    var BUSINESS_TYPES = [
        { id: 'mini_grocery',  label: 'Mini Grocery / Sari-Sari Store', icon: 'fas fa-store' },
        { id: 'restaurant',    label: 'Restaurant / Carinderia',         icon: 'fas fa-utensils' },
        { id: 'food_cart',     label: 'Food Cart / Street Food',         icon: 'fas fa-hamburger' },
        { id: 'bakery',        label: 'Bakery / Pastry Shop',            icon: 'fas fa-bread-slice' },
        { id: 'catering',      label: 'Catering Services',               icon: 'fas fa-concierge-bell' },
        { id: 'clothing',      label: 'Clothing / Boutique',             icon: 'fas fa-tshirt' },
        { id: 'hardware',      label: 'Hardware Store',                  icon: 'fas fa-tools' },
        { id: 'pharmacy',      label: 'Pharmacy / Drugstore',            icon: 'fas fa-pills' },
        { id: 'water',         label: 'Water Refilling Station',         icon: 'fas fa-tint' },
        { id: 'laundry',       label: 'Laundry Business',                icon: 'fas fa-soap' },
        { id: 'salon',         label: 'Salon / Barbershop',              icon: 'fas fa-cut' },
        { id: 'farming',       label: 'Farming / Livestock',             icon: 'fas fa-seedling' },
        { id: 'printing',      label: 'Printing / Signage',              icon: 'fas fa-print' },
        { id: 'online',        label: 'Online Selling / E-commerce',     icon: 'fas fa-laptop' },
        { id: 'repair',        label: 'Repair Shop',                     icon: 'fas fa-wrench' },
        { id: 'other',         label: 'Other Business',                  icon: 'fas fa-briefcase' }
    ];

    var PH_REGIONS = [
        'NCR - Metro Manila',
        'CAR - Cordillera Administrative Region',
        'Region I - Ilocos Region',
        'Region II - Cagayan Valley',
        'Region III - Central Luzon',
        'Region IV-A - CALABARZON',
        'Region IV-B - MIMAROPA',
        'Region V - Bicol Region',
        'Region VI - Western Visayas',
        'Region VII - Central Visayas',
        'Region VIII - Eastern Visayas',
        'Region IX - Zamboanga Peninsula',
        'Region X - Northern Mindanao',
        'Region XI - Davao Region',
        'Region XII - SOCCSKSARGEN',
        'Region XIII - CARAGA',
        'BARMM - Bangsamoro'
    ];

    var SUPPLIERS = [
        // ── NATIONAL ──────────────────────────────────────────────────────────
        { id: 'puregold', name: 'Puregold Price Club', icon: '🏬',
          type: 'National Wholesale', regions: 'all',
          for: ['mini_grocery','restaurant','catering','food_cart','bakery'],
          description: 'Buy groceries, beverages, and household goods in bulk at wholesale prices. Available in major cities nationwide.',
          contact: 'puregold.com.ph | Nearest Puregold branch', coverage: 'Nationwide' },

        { id: 'snr', name: 'S&R Membership Shopping', icon: '🏪',
          type: 'Wholesale Club', regions: 'all',
          for: ['mini_grocery','restaurant','catering','bakery'],
          description: 'Membership-based bulk buying. Wide selection of local and imported food products.',
          contact: 'snrshopping.com | Major cities', coverage: 'Major Cities' },

        { id: 'landers', name: 'Landers Superstore', icon: '🛒',
          type: 'Wholesale Club', regions: ['NCR','Region VII','Region XI'],
          for: ['mini_grocery','restaurant','catering','food_cart'],
          description: 'Bulk food, frozen goods, beverages, and imported items.',
          contact: 'landers.ph | NCR, Cebu, Davao', coverage: 'NCR, Cebu, Davao' },

        { id: 'urc', name: 'Universal Robina Corp (URC)', icon: '🏭',
          type: 'FMCG Distributor', regions: 'all',
          for: ['mini_grocery','food_cart','restaurant'],
          description: 'C2, Jack n Jill, Nissin, Great Taste. Contact area distributor for bulk orders.',
          contact: 'urc.com.ph | +63 2 8702-4700', coverage: 'Nationwide via distributors' },

        { id: 'smc', name: 'San Miguel Corporation', icon: '🍺',
          type: 'National Distributor', regions: 'all',
          for: ['mini_grocery','restaurant','catering'],
          description: 'Beer, San Mig Light, Magnolia dairy, Purefoods meats, Star Margarine.',
          contact: 'sanmiguel.com.ph | Area sales representative', coverage: 'Nationwide' },

        { id: 'coke', name: 'Coca-Cola Philippines', icon: '🥤',
          type: 'Beverage Distributor', regions: 'all',
          for: ['mini_grocery','restaurant','food_cart','catering'],
          description: 'Coke, Sprite, Royal, Minute Maid. Contact local dealer for stocking arrangements.',
          contact: 'ph.coca-colabottlers.com | Local Coke dealer', coverage: 'Nationwide' },

        { id: 'monde', name: 'Monde Nissin', icon: '🍜',
          type: 'FMCG Distributor', regions: 'all',
          for: ['mini_grocery','restaurant'],
          description: 'Lucky Me! noodles, SkyFlakes, Fita, Monde bread. Bulk pricing via area distributor.',
          contact: 'mondenissin.com | Local distributor', coverage: 'Nationwide' },

        { id: 'nestle', name: 'Nestle Philippines', icon: '☕',
          type: 'FMCG Supplier', regions: 'all',
          for: ['mini_grocery','restaurant','catering','bakery'],
          description: 'Nescafe, Milo, KitKat, Maggi seasoning, Bear Brand, Coffee-mate.',
          contact: 'nestle.com.ph | 1-800-1-637-853', coverage: 'Nationwide' },

        { id: 'unilever', name: 'Unilever Philippines', icon: '🧴',
          type: 'FMCG Supplier', regions: 'all',
          for: ['mini_grocery'],
          description: 'Sunsilk, Dove, Cream Silk, Surf, Knorr, Rexona, Lady\'s Choice.',
          contact: 'unilever.com.ph | Area distributor', coverage: 'Nationwide' },

        { id: 'pg', name: 'Procter & Gamble PH', icon: '🧼',
          type: 'FMCG Supplier', regions: 'all',
          for: ['mini_grocery'],
          description: 'Ariel, Downy, Pampers, Head & Shoulders, Olay, Oral-B.',
          contact: 'pg.com/en_PH | Area distributor', coverage: 'Nationwide' },

        { id: 'rebisco', name: 'Rebisco / Republic Biscuit', icon: '🍪',
          type: 'FMCG Distributor', regions: 'all',
          for: ['mini_grocery'],
          description: 'Cream-O, Hi-Ro, Rebisco biscuits, breadsticks, wafers.',
          contact: 'rebisco.com.ph | Local distributor', coverage: 'Nationwide' },

        { id: 'pilmico', name: 'Pilmico Foods Corp', icon: '🌾',
          type: 'Baking / Feed Supplier', regions: 'all',
          for: ['bakery','restaurant','catering','farming'],
          description: 'Bread flour, all-purpose flour, Fiesta hog and poultry feeds.',
          contact: 'pilmico.com | 1800-10-745-6246', coverage: 'Nationwide' },

        { id: 'grand_harvest', name: 'Grand Harvest (Baking Supplies)', icon: '🎂',
          type: 'Baking Ingredient Supplier', regions: 'all',
          for: ['bakery','catering','restaurant'],
          description: 'Bulk flour, sugar, butter, margarine, chocolate chips, and decorating supplies.',
          contact: 'grandharvestph.com | Agri-supply stores', coverage: 'Nationwide' },

        { id: 'wilcon', name: 'Wilcon Depot', icon: '🔨',
          type: 'Hardware Wholesale', regions: 'all',
          for: ['hardware'],
          description: 'Construction materials, tools, plumbing, electrical supplies. Contractor discount available.',
          contact: 'wilcon.com.ph | Branches nationwide', coverage: 'Nationwide' },

        { id: 'ace', name: 'Ace Hardware Philippines', icon: '🪛',
          type: 'Hardware Retailer', regions: 'all',
          for: ['hardware','repair'],
          description: 'Wide range of tools, paint, plumbing, electrical, and garden supplies.',
          contact: 'acehardware.com.ph | Major malls', coverage: 'Major Cities' },

        { id: 'zuellig', name: 'Zuellig Pharma Philippines', icon: '💊',
          type: 'Pharmaceutical Distributor', regions: 'all',
          for: ['pharmacy'],
          description: '#1 pharma distributor in the PH. Requires accreditation and pharmacy license.',
          contact: 'zuelligpharma.com | +63 2 8887-9000', coverage: 'Nationwide' },

        { id: 'generika', name: 'Generika Drugstore', icon: '💉',
          type: 'Pharma Franchise', regions: 'all',
          for: ['pharmacy'],
          description: 'Franchise a Generika store for turnkey setup including generic drug supply chain.',
          contact: 'generika.com.ph | Franchise hotline', coverage: 'Nationwide' },

        { id: 'wella', name: 'Wella / Schwarzkopf PH', icon: '💇',
          type: 'Professional Salon Supplier', regions: 'all',
          for: ['salon'],
          description: 'Professional hair color, treatments, perming solutions, styling products.',
          contact: 'wella.com | Pascual Laboratories (PH distributor)', coverage: 'Nationwide' },

        { id: 'alliance_laundry', name: 'Alliance Laundry Systems PH', icon: '🫧',
          type: 'Equipment Supplier', regions: 'all',
          for: ['laundry'],
          description: 'Speed Queen commercial washers and dryers — industry standard for laundry shops.',
          contact: 'alliancels.com | PH authorized dealers', coverage: 'Nationwide' },

        { id: 'ez_water', name: 'E-Z Water Systems', icon: '💧',
          type: 'Water Station Setup', regions: 'all',
          for: ['water'],
          description: 'Complete turn-key water refilling station: RO systems, storage tanks, dispensers.',
          contact: 'ezwatersystems.ph', coverage: 'Nationwide' },

        { id: 'epson_ph', name: 'EPSON Philippines', icon: '🖨️',
          type: 'Printing Equipment', regions: 'all',
          for: ['printing'],
          description: 'EcoTank, sublimation, wide-format tarpaulin printers for printing businesses.',
          contact: 'epson.com.ph | Authorized resellers', coverage: 'Nationwide' },

        { id: 'ew_seed', name: 'East-West Seed Philippines', icon: '🌱',
          type: 'Agricultural Seed Supplier', regions: 'all',
          for: ['farming'],
          description: 'High-yielding vegetable seeds: ampalaya, pechay, kangkong, tomato, sitaw.',
          contact: 'eastwestseed.com | Agri-supply stores', coverage: 'Nationwide' },

        { id: 'cargill', name: 'Cargill Philippines', icon: '🐔',
          type: 'Animal Feed Supplier', regions: 'all',
          for: ['farming'],
          description: 'Cargill feeds for poultry, swine, and aquaculture operations.',
          contact: 'cargill.com.ph | Regional distributors', coverage: 'Nationwide' },

        { id: 'da_rfo', name: 'DA - Dept. of Agriculture', icon: '🌿',
          type: 'Government Resource', regions: 'all',
          for: ['farming'],
          description: 'Free seedlings, training, SURE-AI crop insurance, and ARCP loans via DA field offices.',
          contact: 'da.gov.ph | Nearest DA regional field office', coverage: 'Nationwide (Free)' },

        { id: 'lazada_sell', name: 'Lazada / TikTok Shop', icon: '📱',
          type: 'E-Commerce Platform', regions: 'all',
          for: ['online','clothing','mini_grocery'],
          description: 'List your products for free. Built-in logistics and large buyer base.',
          contact: 'lazada.com.ph/sell | seller.tiktok.com', coverage: 'Nationwide' },

        { id: 'shopee_sell', name: 'Shopee Seller Center', icon: '🛍️',
          type: 'E-Commerce Platform', regions: 'all',
          for: ['online','clothing','mini_grocery'],
          description: 'Philippines\' top e-commerce. Free to list, Shopee Express delivery nationwide.',
          contact: 'shopee.ph/seller-center | 1-800-8742-5877', coverage: 'Nationwide' },

        { id: 'dti', name: 'DTI Negosyo Center', icon: '🏛️',
          type: 'Government Resource', regions: 'all',
          for: ['mini_grocery','restaurant','food_cart','clothing','hardware','bakery','catering',
                'other','online','salon','laundry','water','pharmacy','farming','printing','repair'],
          description: 'Free business registration, mentoring, market linkage, and loans. Go-Negosyo act.',
          contact: 'dti.gov.ph | Nearest DTI provincial/city office', coverage: 'Nationwide (Free)' },

        { id: 'dost_setup', name: 'DOST SETUP Program', icon: '🔬',
          type: 'Government Grant', regions: 'all',
          for: ['bakery','food_cart','farming','water','printing','catering','restaurant'],
          description: 'Grants for equipment upgrade for micro-enterprises. Up to PHP 500,000 in support.',
          contact: 'dost.gov.ph/setup | Nearest DOST regional office', coverage: 'Nationwide (Free)' },

        { id: 'bdo_sme', name: 'BDO / BPI SME Loan', icon: '🏦',
          type: 'Business Financing', regions: 'all',
          for: ['mini_grocery','restaurant','hardware','pharmacy','other','clothing','bakery','catering'],
          description: 'SME loans for working capital and equipment. BDO SME Loan starts at PHP 300,000.',
          contact: 'bdo.com.ph/sme | bpi.com.ph/business', coverage: 'Nationwide' },

        // ── REGIONAL ──────────────────────────────────────────────────────────
        { id: 'divisoria', name: 'Divisoria Wholesale Market', icon: '🏙️',
          type: 'Regional Wholesale Hub', regions: ['NCR','Region III','Region IV-A'],
          for: ['mini_grocery','clothing','online','printing','hardware','other'],
          description: 'Lowest-price wholesale for groceries, clothing, packaging, and general goods. Pickup or delivery.',
          contact: 'On-site: Divisoria, Tondo, Manila', coverage: 'NCR & nearby provinces' },

        { id: 'tutuban', name: 'Tutuban Center Market', icon: '🏬',
          type: 'Fashion Wholesale', regions: ['NCR'],
          for: ['clothing','online'],
          description: 'Affordable clothing, accessories, bags, and household goods at wholesale prices.',
          contact: 'Claro M. Recto Ave., Manila', coverage: 'NCR' },

        { id: 'taytay', name: 'Taytay Fashion Market', icon: '👗',
          type: 'Garment Manufacturer Hub', regions: ['NCR','Region IV-A'],
          for: ['clothing','online'],
          description: 'Taytay, Rizal — fashion capital. Buy direct from garment and RTW manufacturers.',
          contact: 'Taytay Shopping Complex, Taytay, Rizal', coverage: 'NCR & CALABARZON' },

        { id: 'quiapo', name: 'Quiapo Electronics District', icon: '📡',
          type: 'Parts & Electronics Hub', regions: ['NCR'],
          for: ['repair','printing','online'],
          description: 'Electronic components, spare parts, cameras, accessories at the lowest prices.',
          contact: 'Quiapo District, Manila (on-site)', coverage: 'NCR' },

        { id: 'ne_rice', name: 'Nueva Ecija Rice Traders', icon: '🌾',
          type: 'Agricultural Supplier', regions: ['Region III','NCR','Region IV-A'],
          for: ['mini_grocery','restaurant','catering'],
          description: 'Buy NFA or commercial rice in bulk direct from the rice granary of the Philippines.',
          contact: 'Cabanatuan City rice trading posts, Nueva Ecija', coverage: 'Luzon-wide' },

        { id: 'batangas_fish', name: 'Batangas Fish Landing Port', icon: '🐟',
          type: 'Seafood Supplier', regions: ['Region IV-A','NCR'],
          for: ['restaurant','catering','mini_grocery'],
          description: 'Fresh daily catch from Batangas port. Competitive wholesale pricing for fish and shellfish.',
          contact: 'Batangas City Port Area, Batangas', coverage: 'Luzon' },

        { id: 'cartimar', name: 'Cartimar Shopping Center', icon: '🔌',
          type: 'Specialty Wholesale', regions: ['NCR'],
          for: ['repair','hardware','other'],
          description: 'Pet supplies, electrical tools, fabrics, specialty equipment at very low prices.',
          contact: 'Cartimar Ave., Pasay City', coverage: 'NCR' },

        { id: 'cebu_carbon', name: 'Carbon Market Cebu', icon: '🌆',
          type: 'Regional Market', regions: ['Region VII'],
          for: ['mini_grocery','restaurant','catering','clothing'],
          description: 'Visayas\' largest public market. Fresh produce, dry goods, clothing, and seafood.',
          contact: 'Carbon Market, Cebu City', coverage: 'Visayas' },

        { id: 'cebu_mango', name: 'Cebu Mango / Dried Goods Traders', icon: '🥭',
          type: 'Regional Food Supplier', regions: ['Region VII'],
          for: ['mini_grocery','online','catering'],
          description: 'Dried mangoes, otap, torta, and Cebuano food specialties in bulk.',
          contact: 'Pasil Market & SM City Cebu wholesale area', coverage: 'Visayas' },

        { id: 'iloilo_market', name: 'Iloilo Central Market', icon: '🏙️',
          type: 'Regional Market', regions: ['Region VI'],
          for: ['mini_grocery','restaurant','catering'],
          description: 'Western Visayas\' main market hub. Fresh produce, fish, meat, and dry goods.',
          contact: 'Iloilo Central Market, Iloilo City', coverage: 'Western Visayas' },

        { id: 'davao_bankerohan', name: 'Bankerohan Public Market', icon: '🐄',
          type: 'Regional Market', regions: ['Region XI'],
          for: ['restaurant','catering','mini_grocery'],
          description: 'Davao\'s largest public market. Fresh meat, seafood, produce, and dry goods.',
          contact: 'Bankerohan Market, Davao City', coverage: 'Mindanao' },

        { id: 'davao_agri', name: 'Davao Agri-Trade Center', icon: '🍌',
          type: 'Agricultural Produce', regions: ['Region XI','Region XII','Region XIII'],
          for: ['mini_grocery','restaurant','farming','catering'],
          description: 'Banana, durian, cacao, coffee, fresh vegetables direct from Mindanao farms.',
          contact: 'Davao City Trade & Investment Promotion Office', coverage: 'Mindanao' },

        { id: 'cdo_market', name: 'CDO Cogon Market', icon: '🌻',
          type: 'Regional Market', regions: ['Region X'],
          for: ['mini_grocery','restaurant','catering'],
          description: 'Northern Mindanao\'s largest market. Full range of fresh and dry goods.',
          contact: 'Cogon Market, Cagayan de Oro City', coverage: 'Northern Mindanao' },

        { id: 'gensan_fish', name: 'General Santos Fish Port', icon: '🐠',
          type: 'Seafood Wholesale Hub', regions: ['Region XII','Region XI'],
          for: ['restaurant','catering','mini_grocery'],
          description: 'Tuna capital of the Philippines. Fresh tuna and seafood at wholesale prices.',
          contact: 'GenSan Fish Port Complex, General Santos City', coverage: 'Mindanao' },

        { id: 'island_hw', name: 'Island Hardware (Visayas/Mindanao)', icon: '🏗️',
          type: 'Regional Hardware Chain', regions: ['Region VII','Region VIII','Region XI'],
          for: ['hardware'],
          description: 'Key hardware and construction supply retailer across Visayas and Mindanao.',
          contact: 'Various branches across Visayas & Mindanao', coverage: 'Visayas, Mindanao' },

        { id: 'bohol_handicraft', name: 'Bohol Handicraft Suppliers', icon: '🪑',
          type: 'Craft & Furniture Supplier', regions: ['Region VII'],
          for: ['online','other'],
          description: 'Rattan, bamboo, and native craft products. Great for online resellers.',
          contact: 'Tagbilaran Public Market, Bohol', coverage: 'Visayas' },

        { id: 'bicol_abaca', name: 'Bicol Abaca Products', icon: '🧺',
          type: 'Regional Craft Supplier', regions: ['Region V'],
          for: ['online','clothing','other'],
          description: 'Abaca fiber products, native bags, placemats. Great for online and tiangge selling.',
          contact: 'Albay and Sorsogon cooperative markets', coverage: 'Bicol Region' }
    ];

    function getRegionKey(regionStr) {
        if (!regionStr) return null;
        var r = regionStr.toLowerCase();
        if (r.includes('ncr') || r.includes('metro manila')) return 'NCR';
        if (r.includes('iii') && !r.includes('iv')) return 'Region III';
        if (r.includes('iv-a') || r.includes('calabarzon')) return 'Region IV-A';
        if (r.includes('iv-b') || r.includes('mimaropa')) return 'Region IV-B';
        if (r.includes('vii') && !r.includes('viii')) return 'Region VII';
        if (r.includes('viii')) return 'Region VIII';
        if (r.includes('xi') && !r.includes('xii') && !r.includes('xiii')) return 'Region XI';
        if (r.includes('xii') && !r.includes('xiii')) return 'Region XII';
        if (r.includes('xiii') || r.includes('caraga')) return 'Region XIII';
        if (r.includes('x ') || r.includes('northern mindanao')) return 'Region X';
        if (r.includes('vi ') || r.includes('western visayas')) return 'Region VI';
        if (r.includes('v ') || r.includes('bicol')) return 'Region V';
        return null;
    }

    function getMatchingSuppliers(businessTypeId, region) {
        var regionKey = getRegionKey(region);
        return SUPPLIERS.filter(function (s) {
            var forMatch = !businessTypeId || s.for.includes(businessTypeId);
            var regionMatch = s.regions === 'all' || !regionKey ||
                              (Array.isArray(s.regions) && s.regions.includes(regionKey));
            return forMatch && regionMatch;
        });
    }

    var currentProductId = null;
    var selectedBusinessType = null;
    var selectedSupplierIds = [];

    var TIER_MAP = { 1: 'starter', 2: 'founder', 3: 'complete', 4: 'custom' };

    function createModalDOM() {
        var overlay = document.createElement('div');
        overlay.id = 'bf-overlay';
        overlay.className = 'bf-overlay';
        overlay.innerHTML =
            '<div class="bf-modal" role="dialog" aria-modal="true" aria-labelledby="bf-modal-title">' +
              '<div class="bf-header">' +
                '<div>' +
                  '<h3 id="bf-modal-title"><i class="fas fa-clipboard-list" style="color:var(--orange);margin-right:0.4rem;"></i>Customize Your Business Plan</h3>' +
                  '<p id="bf-product-label" style="color:var(--text-muted);font-size:0.82rem;margin-top:0.2rem;"></p>' +
                '</div>' +
                '<button class="bf-close" id="bf-close-btn" aria-label="Close">&times;</button>' +
              '</div>' +

              '<div class="bf-body">' +

                // Step 1: Capital & Description
                '<div class="bf-section">' +
                  '<div class="bf-section-label"><span class="step-num">1</span> Capital & Business Goal</div>' +
                  '<div class="form-group">' +
                    '<label for="bf-capital">Available Capital / Budget (PHP)</label>' +
                    '<input type="number" id="bf-capital" placeholder="e.g. 50000" min="0" step="1000" style="font-size:0.95rem;">' +
                    '<div id="bf-capital-hint" style="font-size:0.77rem;color:var(--orange);margin-top:0.35rem;font-weight:600;"></div>' +
                  '</div>' +
                  '<div class="form-group" style="margin-top:0.85rem;">' +
                    '<label for="bf-description">Brief Business Description <span style="font-weight:400;color:var(--text-muted);">(optional)</span></label>' +
                    '<textarea id="bf-description" rows="2" placeholder="e.g. Small sari-sari store in our barangay, near a school" style="resize:vertical;min-height:60px;font-size:0.88rem;"></textarea>' +
                  '</div>' +
                '</div>' +

                // Step 2: Location
                '<div class="bf-section">' +
                  '<div class="bf-section-label"><span class="step-num">2</span> Business Location</div>' +
                  '<div class="form-grid" style="gap:0.75rem;">' +
                    '<div class="form-group">' +
                      '<label for="bf-country">Country</label>' +
                      '<input type="text" id="bf-country" value="Philippines" placeholder="e.g. Philippines, UAE, Canada">' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label for="bf-region">Region / Province</label>' +
                      '<select id="bf-region"><option value="">-- Select Region (Philippines) --</option></select>' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label for="bf-city">City / Municipality</label>' +
                      '<input type="text" id="bf-city" placeholder="e.g. Quezon City, Cebu, Davao">' +
                    '</div>' +
                    '<div class="form-group">' +
                      '<label for="bf-subdivision">Subdivision / Barangay</label>' +
                      '<input type="text" id="bf-subdivision" placeholder="e.g. Brgy. Poblacion, Village Name">' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                // Step 3: Suppliers
                '<div class="bf-section">' +
                  '<div class="bf-section-label"><span class="step-num">3</span> Recommended Suppliers</div>' +
                  '<p id="bf-supplier-hint" style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem;">' +
                    'Select your region above to see recommended national and local suppliers.' +
                  '</p>' +
                  '<div class="bf-supplier-grid" id="bf-supplier-grid"></div>' +
                '</div>' +

              '</div>' + // .bf-body

              '<div class="bf-footer">' +
                '<p id="bf-summary-text" style="font-size:0.8rem;color:var(--text-muted);flex:1;"></p>' +
                '<button type="button" class="button secondary" id="bf-cancel-btn"><i class="fas fa-times"></i> Cancel</button>' +
                '<button type="button" class="button" id="bf-submit-btn"><i class="fas fa-cart-plus"></i> Add to Cart</button>' +
              '</div>' +
            '</div>'; // .bf-modal

        document.body.appendChild(overlay);

        // Populate region select
        var regionSel = overlay.querySelector('#bf-region');
        PH_REGIONS.forEach(function (r) {
            var opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r;
            regionSel.appendChild(opt);
        });

        // Events
        overlay.querySelector('#bf-close-btn').addEventListener('click', close);
        overlay.querySelector('#bf-cancel-btn').addEventListener('click', close);
        overlay.querySelector('#bf-submit-btn').addEventListener('click', handleSubmit);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });

        var capitalInput = overlay.querySelector('#bf-capital');
        capitalInput.addEventListener('input', updateCapitalHint);

        regionSel.addEventListener('change', updateSuppliers);

        return overlay;
    }

    function selectBusinessType(typeId) {
        selectedBusinessType = typeId;
        document.querySelectorAll('.bf-type-chip').forEach(function (chip) {
            chip.classList.toggle('selected', chip.getAttribute('data-type') === typeId);
        });
        updateSuppliers();
        updateSummary();
    }

    function updateCapitalHint() {
        var val = parseFloat(document.getElementById('bf-capital').value) || 0;
        var hint = document.getElementById('bf-capital-hint');
        if (!hint) return;
        if (val <= 0) { hint.textContent = ''; return; }
        if (val < 10000) {
            hint.textContent = '⚡ Micro-budget: Consider sari-sari store, online selling, or food cart.';
        } else if (val < 50000) {
            hint.textContent = '💡 Small budget: Great for sari-sari store, food cart, or online reselling.';
        } else if (val < 150000) {
            hint.textContent = '✅ Good budget: Suitable for carinderia, small grocery, or laundry shop.';
        } else if (val < 500000) {
            hint.textContent = '🚀 Medium budget: Consider hardware, pharmacy, bakery, or restaurant.';
        } else {
            hint.textContent = '🏆 Strong capital: You can open a full-scale business or franchise.';
        }
    }

    function updateSuppliers() {
        var region = (document.getElementById('bf-region') || {}).value || '';
        var suppliers = getMatchingSuppliers(selectedBusinessType, region);
        var grid = document.getElementById('bf-supplier-grid');
        var hint = document.getElementById('bf-supplier-hint');
        if (!grid) return;

        if (!region) {
            grid.innerHTML = '';
            if (hint) hint.style.display = 'block';
            return;
        }
        if (hint) hint.style.display = 'none';

        if (suppliers.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No specific suppliers found. Check DTI Negosyo Center for local supplier matching.</p>';
            return;
        }

        grid.innerHTML = suppliers.map(function (s) {
            var isSelected = selectedSupplierIds.indexOf(s.id) !== -1;
            return '<div class="bf-supplier-card' + (isSelected ? ' selected' : '') + '" data-sid="' + s.id + '">' +
                '<div class="bf-supplier-icon">' + s.icon + '</div>' +
                '<div class="bf-supplier-info">' +
                    '<h5>' + s.name + '</h5>' +
                    '<p>' + s.description + '</p>' +
                    '<div class="bf-supplier-meta">' +
                        '<span style="background:rgba(232,66,10,0.1);padding:0.15rem 0.5rem;border-radius:999px;margin-right:0.4rem;">' + s.type + '</span>' +
                        '<span style="color:var(--text-muted);">' + s.coverage + '</span>' +
                    '</div>' +
                    '<p style="font-size:0.74rem;color:var(--navy);margin-top:0.3rem;font-weight:600;">' +
                        '<i class="fas fa-phone-alt" style="margin-right:0.3rem;color:var(--amber);"></i>' + s.contact +
                    '</p>' +
                '</div>' +
                '<div class="bf-supplier-check"><i class="fas fa-check"></i></div>' +
            '</div>';
        }).join('');

        grid.querySelectorAll('.bf-supplier-card').forEach(function (card) {
            card.addEventListener('click', function () {
                toggleSupplier(this.getAttribute('data-sid'));
                this.classList.toggle('selected');
                this.querySelector('.bf-supplier-check').classList.toggle('checked');
            });
        });
    }

    function toggleSupplier(supplierId) {
        var idx = selectedSupplierIds.indexOf(supplierId);
        if (idx === -1) {
            selectedSupplierIds.push(supplierId);
        } else {
            selectedSupplierIds.splice(idx, 1);
        }
        updateSummary();
    }

    function updateSummary() {
        var text = document.getElementById('bf-summary-text');
        if (!text) return;
        text.textContent = selectedSupplierIds.length > 0
            ? selectedSupplierIds.length + ' supplier' + (selectedSupplierIds.length > 1 ? 's' : '') + ' selected'
            : 'Fill in your details to customize the blueprint.';
    }

    function handleSubmit() {
        var bt = BUSINESS_TYPES.find(function (t) { return t.id === selectedBusinessType; });
        var selectedSupplierData = SUPPLIERS.filter(function (s) {
            return selectedSupplierIds.indexOf(s.id) !== -1;
        }).map(function (s) {
            return { name: s.name, type: s.type, contact: s.contact, coverage: s.coverage };
        });

        var customization = {
            businessType: selectedBusinessType,
            businessTypeLabel: bt ? bt.label : selectedBusinessType,
            bundleTier: TIER_MAP[currentProductId] || 'starter',
            description: (document.getElementById('bf-description') || {}).value || '',
            capital: parseFloat((document.getElementById('bf-capital') || {}).value) || 0,
            location: {
                country: (document.getElementById('bf-country') || {}).value || 'Philippines',
                region: (document.getElementById('bf-region') || {}).value || '',
                city: (document.getElementById('bf-city') || {}).value || '',
                subdivision: (document.getElementById('bf-subdivision') || {}).value || ''
            },
            suppliers: selectedSupplierData,
            timestamp: new Date().toISOString()
        };

        close();

        if (window.Cart && window.Cart.addToCartDirect) {
            window.Cart.addToCartDirect(currentProductId, customization);
        }

        // Fire quick AI feasibility analysis in the background (non-blocking)
        if (window.NegosyoAPI && window.NegosyoAPI.showQuickAnalysisToast) {
            window.NegosyoAPI.showQuickAnalysisToast(customization, currentProductId);
        }
    }

    function show(productId) {
        currentProductId = productId;
        selectedSupplierIds = [];
        selectedBusinessType = null;

        var overlay = document.getElementById('bf-overlay');
        if (!overlay) overlay = createModalDOM();

        // Reset form state
        var capitalEl = document.getElementById('bf-capital');
        if (capitalEl) capitalEl.value = '';
        var descEl = document.getElementById('bf-description');
        if (descEl) descEl.value = '';
        var countryEl = document.getElementById('bf-country');
        if (countryEl) countryEl.value = 'Philippines';
        var regionEl = document.getElementById('bf-region');
        if (regionEl) regionEl.value = '';
        var cityEl = document.getElementById('bf-city');
        if (cityEl) cityEl.value = '';
        var subEl = document.getElementById('bf-subdivision');
        if (subEl) subEl.value = '';
        var hintEl = document.getElementById('bf-capital-hint');
        if (hintEl) hintEl.textContent = '';
        var gridEl = document.getElementById('bf-supplier-grid');
        if (gridEl) gridEl.innerHTML = '';
        var supplierHint = document.getElementById('bf-supplier-hint');
        if (supplierHint) supplierHint.style.display = 'block';
        updateSummary();

        // Set product label
        var label = document.getElementById('bf-product-label');
        if (label) {
            var productNames = { 1: 'Starter Bundle', 2: 'Founder Bundle', 3: 'Complete Set Bundle', 4: 'Custom Bundle' };
            label.textContent = 'Customizing for: ' + (productNames[productId] || 'Bundle #' + productId);
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        var overlay = document.getElementById('bf-overlay');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.BusinessForm = { show: show, close: close };
})();
