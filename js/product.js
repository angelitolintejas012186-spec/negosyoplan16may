// product.js - Product detail page functionality

const PRODUCTS = [
    {
        id: 1,
        name: 'Starter Bundle',
        price: 1900,
        tier: 'starter',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The perfect starting point for new entrepreneurs. This bundle gives you a practical business plan template, financial projection model, and a complete market analysis guide — everything you need to confidently launch your first venture.',
        rating: 4.5,
        reviews: 120,
        features: [
            { icon: 'fas fa-file-alt',    text: 'Business plan template (30+ pages)' },
            { icon: 'fas fa-chart-line',  text: 'Financial projection spreadsheet (12 months)' },
            { icon: 'fas fa-search',      text: 'Market analysis and competitor guide' },
            { icon: 'fas fa-tasks',       text: 'Launch checklist and milestone tracker' },
            { icon: 'fas fa-lightbulb',   text: 'SWOT, FIFO & risk analysis frameworks' }
        ],
        methodology: [
            { step: 'Diagnose', desc: 'Identify your market, audience, and competition.' },
            { step: 'Design',   desc: 'Plan your business model, pricing, and structure.' },
            { step: 'Validate', desc: 'Test your idea before committing full capital.' }
        ]
    },
    {
        id: 2,
        name: 'Founder Bundle',
        price: 2600,
        tier: 'founder',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Built for serious entrepreneurs ready to scale. The Founder Bundle includes complete strategy, marketing automation, investor pitch materials, and operational frameworks designed for businesses in growth mode.',
        rating: 5.0,
        reviews: 85,
        features: [
            { icon: 'fas fa-bullseye',    text: 'Advanced business model canvas' },
            { icon: 'fas fa-ad',          text: 'Full marketing and social media strategy' },
            { icon: 'fas fa-handshake',   text: 'Investor pitch deck framework' },
            { icon: 'fas fa-cogs',        text: 'Operational SOP and process templates' },
            { icon: 'fas fa-users',       text: 'Team structure and hiring guide' },
            { icon: 'fas fa-trophy',      text: 'Revenue growth and KPI tracking tools' }
        ],
        methodology: [
            { step: 'Diagnose', desc: 'Deep-dive market and competitive intelligence.' },
            { step: 'Design',   desc: 'Build scalable systems and revenue models.' },
            { step: 'Launch',   desc: 'Go-to-market playbook and customer acquisition.' },
            { step: 'Scale',    desc: 'Systemize operations for repeatable growth.' }
        ]
    },
    {
        id: 3,
        name: 'Complete Set Bundle',
        price: 3500,
        tier: 'complete',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The most comprehensive business planning kit available. The Complete Set includes every resource from both Starter and Founder bundles, plus exclusive growth playbooks, revenue models, and a full business launch system.',
        rating: 4.8,
        reviews: 200,
        features: [
            { icon: 'fas fa-layer-group',   text: 'All Starter and Founder bundle resources' },
            { icon: 'fas fa-rocket',        text: 'Complete business launch system' },
            { icon: 'fas fa-chart-bar',     text: '3-year revenue projection and growth model' },
            { icon: 'fas fa-map',           text: 'Market penetration and scaling playbook' },
            { icon: 'fas fa-balance-scale', text: 'Legal, compliance, and risk register' },
            { icon: 'fas fa-star',          text: 'Brand identity and retention system' }
        ],
        methodology: [
            { step: 'Diagnose', desc: 'Full market, financial, and competitive analysis.' },
            { step: 'Design',   desc: 'Build a complete, scalable business architecture.' },
            { step: 'Validate', desc: 'Proof-of-concept and demand testing framework.' },
            { step: 'Launch',   desc: 'Coordinated go-to-market execution plan.' },
            { step: 'Scale',    desc: 'Revenue scaling and team growth systems.' }
        ]
    },
    {
        id: 4,
        name: 'Custom Bundle',
        price: 4600,
        tier: 'custom',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'A fully personalized business blueprint built specifically for your industry, city, and capital level. All 8 management frameworks are customized to your exact business type, including your selected suppliers and location strategy.',
        rating: 4.9,
        reviews: 65,
        features: [
            { icon: 'fas fa-user-cog',        text: 'Personalized industry-specific roadmap' },
            { icon: 'fas fa-map-marker-alt',  text: 'Location-aware market research (your city)' },
            { icon: 'fas fa-money-bill-wave', text: 'Custom financial model for your budget' },
            { icon: 'fas fa-paint-brush',     text: 'Brand identity and positioning guide' },
            { icon: 'fas fa-comments',        text: 'One-on-one consultation via WhatsApp' },
            { icon: 'fas fa-sync',            text: 'One free revision within 30 days' }
        ],
        methodology: [
            { step: 'Design',   desc: 'Fully tailored business model for your context.' },
            { step: 'Validate', desc: 'Custom demand validation for your market.' },
            { step: 'Launch',   desc: 'Step-by-step launch plan for your timeline.' },
            { step: 'Scale',    desc: 'Growth blueprint aligned to your goals.' }
        ]
    }
];

const FRAMEWORK_DATA = {
    starter: [
        {
            icon: 'fas fa-cogs',      bg: '#E8420A', title: 'Management System',
            badge: 'Foundation',
            items: [
                'Daily operations checklist (printable)',
                'Staff roles & responsibilities chart',
                'Opening & closing procedures guide',
                'Simple KPI tracking sheet (sales, customers)'
            ]
        },
        {
            icon: 'fas fa-th-large',  bg: '#6366F1', title: 'SWOT Analysis',
            badge: 'Essential',
            items: [
                '4-quadrant SWOT analysis template',
                'Industry-specific SWOT examples',
                'Action steps derived from SWOT findings',
                'Quarterly SWOT review schedule'
            ]
        },
        {
            icon: 'fas fa-boxes',     bg: '#F5A500', title: 'FIFO Inventory System',
            badge: 'Essential',
            items: [
                'First-In First-Out principle & implementation',
                'Printable stock tracking worksheet',
                'Reorder point calculator',
                'Expiry date management log'
            ]
        },
        {
            icon: 'fas fa-shield-alt', bg: '#EF4444', title: 'Risk Analysis',
            badge: 'Foundation',
            items: [
                '3×3 probability-impact risk matrix',
                'Top 10 startup risks identified',
                'Risk mitigation action cards per risk',
                'Emergency response checklist'
            ]
        },
        {
            icon: 'fas fa-chart-line', bg: '#10B981', title: 'Financial Analysis',
            badge: 'Foundation',
            items: [
                'Startup capital allocation worksheet',
                'Monthly income & expense tracker',
                'Break-even analysis with formula',
                '6-month sales projection template'
            ]
        },
        {
            icon: 'fas fa-chess',      bg: '#0F1F3D', title: 'Business Strategy',
            badge: 'Essential',
            items: [
                'Value proposition statement builder',
                'Target market definition worksheet',
                'Pricing strategy guide (3 models)',
                'Competitive advantage roadmap'
            ]
        },
        {
            icon: 'fas fa-bullhorn',   bg: '#D97706', title: 'Traditional Marketing',
            badge: 'Essential',
            items: [
                'Tarpaulin & signage design specifications',
                'Flyer/leaflet distribution plan',
                'Word-of-mouth referral system',
                'Grand opening event checklist'
            ]
        },
        {
            icon: 'fas fa-hashtag',    bg: '#3B82F6', title: 'Digital Marketing',
            badge: 'Essential',
            items: [
                'Facebook Business page setup guide',
                'Weekly social media content schedule',
                'WhatsApp Business configuration',
                'Google Maps / Google My Business listing'
            ]
        }
    ],
    founder: [
        {
            icon: 'fas fa-cogs',      bg: '#E8420A', title: 'Management System',
            badge: 'Advanced',
            items: [
                'SOP library for 5 core business processes',
                'Staff performance dashboard & KPIs',
                'Vendor scorecard & supplier evaluation',
                'Monthly management review framework'
            ]
        },
        {
            icon: 'fas fa-th-large',  bg: '#6366F1', title: 'SWOT + PESTEL Analysis',
            badge: 'Advanced',
            items: [
                'SWOT combined with PESTEL environment scan',
                'Competitor benchmarking matrix (5 players)',
                'Strategic priority roadmap (12 months)',
                'Competitive positioning & gap analysis'
            ]
        },
        {
            icon: 'fas fa-boxes',     bg: '#F5A500', title: 'FIFO + Inventory Control',
            badge: 'Advanced',
            items: [
                'ABC inventory classification system',
                'Inventory turnover ratio analysis',
                'Just-In-Time (JIT) ordering model',
                'Dead stock identification & clearance plan'
            ]
        },
        {
            icon: 'fas fa-shield-alt', bg: '#EF4444', title: 'Risk Management',
            badge: 'Advanced',
            items: [
                '5×5 comprehensive risk register template',
                'Business continuity plan (BCP)',
                'Insurance requirements checklist',
                'Legal & regulatory compliance framework'
            ]
        },
        {
            icon: 'fas fa-chart-line', bg: '#10B981', title: 'Financial Analysis',
            badge: 'Advanced',
            items: [
                '12-month P&L projection model',
                'Cash flow statement template',
                'Balance sheet + equity calculator',
                'Unit economics: CAC, LTV, gross margin'
            ]
        },
        {
            icon: 'fas fa-chess',      bg: '#0F1F3D', title: 'Business Strategy',
            badge: 'Advanced',
            items: [
                'Porter\'s Five Forces competitive analysis',
                'ANSOFF growth matrix strategy',
                'Investor pitch deck framework (10 slides)',
                'Revenue diversification strategy map'
            ]
        },
        {
            icon: 'fas fa-bullhorn',   bg: '#D97706', title: 'Traditional Marketing',
            badge: 'Advanced',
            items: [
                'Multi-channel traditional marketing calendar',
                'Print advertising copywriting guide',
                'Community events & sponsorship playbook',
                'Media relations & PR basics'
            ]
        },
        {
            icon: 'fas fa-hashtag',    bg: '#3B82F6', title: 'Digital Marketing',
            badge: 'Advanced',
            items: [
                'Meta (Facebook & Instagram) Ads playbook',
                'TikTok Business content & viral strategy',
                'Email & SMS marketing automation setup',
                'Local SEO & Google Ads fundamentals'
            ]
        }
    ],
    complete: [
        {
            icon: 'fas fa-cogs',      bg: '#E8420A', title: 'Management System',
            badge: 'Pro',
            items: [
                'Full Business Operating System (BOS)',
                'Department-level SOP documentation',
                'Quality control & internal audit framework',
                'Business scalability assessment tool'
            ]
        },
        {
            icon: 'fas fa-th-large',  bg: '#6366F1', title: 'SWOT + Strategic Planning',
            badge: 'Pro',
            items: [
                'Annual strategic planning cycle guide',
                'Blue Ocean Strategy opportunities map',
                'Multi-segment SWOT portfolio matrix',
                'Board-ready strategic summary report'
            ]
        },
        {
            icon: 'fas fa-boxes',     bg: '#F5A500', title: 'FIFO + Inventory Optimization',
            badge: 'Pro',
            items: [
                'Multi-location inventory control system',
                'POS integration & automation guide',
                'Shrinkage prevention & loss reduction plan',
                'Demand forecasting & stock optimization'
            ]
        },
        {
            icon: 'fas fa-shield-alt', bg: '#EF4444', title: 'Enterprise Risk Management',
            badge: 'Pro',
            items: [
                'Enterprise risk management (ERM) plan',
                'Scenario planning: best, base, worst case',
                'Complete insurance & legal compliance guide',
                'Crisis communication & recovery plan'
            ]
        },
        {
            icon: 'fas fa-chart-line', bg: '#10B981', title: 'Financial Analysis',
            badge: 'Pro',
            items: [
                '3-year financial projections (P&L, CF, BS)',
                'Business valuation methods guide',
                'ROI & payback period calculator',
                'Investor-ready financial presentation package'
            ]
        },
        {
            icon: 'fas fa-chess',      bg: '#0F1F3D', title: 'Business Strategy',
            badge: 'Pro',
            items: [
                'Franchise & replication model blueprint',
                'Market expansion playbook (multi-city/region)',
                'Partnership & joint venture framework',
                'Exit strategy & business succession planning'
            ]
        },
        {
            icon: 'fas fa-bullhorn',   bg: '#D97706', title: 'Traditional Marketing',
            badge: 'Pro',
            items: [
                'Brand identity & visual standards system',
                'Integrated marketing communications plan',
                'Trade show, exhibition & events strategy',
                'Customer retention & premium loyalty programs'
            ]
        },
        {
            icon: 'fas fa-hashtag',    bg: '#3B82F6', title: 'Digital Marketing',
            badge: 'Pro',
            items: [
                'Full-funnel digital marketing strategy',
                'Influencer & affiliate marketing guide',
                'Marketing automation & CRM setup',
                'Analytics dashboard & ROI reporting system'
            ]
        }
    ]
};

FRAMEWORK_DATA.custom = FRAMEWORK_DATA.complete;

// ── Permits & Licenses Data ───────────────────────────────────────────────────
const PERMIT_DATA = {
    starter: {
        intro: 'Step-by-step guide to legally registering a sole proprietorship in the Philippines.',
        total_cost: '₱1,500 – ₱4,000',
        total_time: '2 – 4 weeks',
        steps: [
            {
                num: 1, accent: '#E8420A', icon: 'fas fa-id-card',
                title: 'DTI Business Name Registration',
                office: 'Department of Trade & Industry (DTI)',
                cost: '₱200 – ₱2,000',
                duration: '1–3 days (same-day online)',
                requirements: [
                    'Valid government-issued ID',
                    'Preferred business names — prepare 3 alternatives',
                    'Accomplished BN Registration Form (online or paper)'
                ],
                where: 'bizname.dti.gov.ph (online) or DTI Provincial/City Office',
                tip: 'Apply online to skip queues. Fee depends on territorial scope: Barangay ₱200, City ₱500, Regional ₱1,000, National ₱2,000.'
            },
            {
                num: 2, accent: '#6366F1', icon: 'fas fa-map-marker-alt',
                title: 'Barangay Business Clearance',
                office: 'Barangay Hall at your business address',
                cost: '₱100 – ₱500',
                duration: '1–2 days',
                requirements: [
                    'DTI Certificate of Registration',
                    'Community Tax Certificate (Cedula / CTC)',
                    'Proof of address — lease contract or property title',
                    'Valid ID with photocopy'
                ],
                where: 'Your local Barangay Hall (no online option in most areas)',
                tip: 'Call ahead — some barangays require a site inspection before issuing clearance, which adds 1–2 extra days.'
            },
            {
                num: 3, accent: '#F5A500', icon: 'fas fa-landmark',
                title: "Mayor's Permit / Business License",
                office: 'City or Municipal Hall — Business Permits & Licensing Office (BPLO)',
                cost: '₱500 – ₱5,000 (based on capitalization & LGU)',
                duration: '3–7 business days',
                requirements: [
                    'DTI Certificate',
                    'Barangay Business Clearance',
                    'Lease contract or land title',
                    'Community Tax Certificate',
                    'Fire Safety Inspection Certificate (FSIC from BFP)',
                    'Sanitary Permit (food or personal service businesses)'
                ],
                where: "City/Municipal Hall BPLO window",
                tip: "Some LGUs (Makati, Pasig, Cebu City) now accept online applications. Check your city's official website before going in person."
            },
            {
                num: 4, accent: '#10B981', icon: 'fas fa-receipt',
                title: 'BIR Registration',
                office: 'Bureau of Internal Revenue — Revenue District Office (RDO)',
                cost: '₱530 (₱500 Annual Registration Fee + ₱30 DST)',
                duration: '1–3 business days',
                requirements: [
                    'DTI Certificate',
                    "Mayor's Permit",
                    'Proof of business address — lease contract',
                    'Valid government ID',
                    'Accomplished BIR Form 1901 (Sole Proprietor)'
                ],
                where: 'BIR RDO with jurisdiction over your address | orus.bir.gov.ph',
                tip: 'Request Authority to Print (ATP) for official receipts at the same visit. Also register your Books of Account (Journal & Ledger) to be BIR-stamped.'
            }
        ],
        reminders: [
            "Renew Mayor's Permit and Barangay Clearance every January",
            'Pay Annual BIR Registration Fee (₱500) before January 31',
            'File quarterly BIR returns — Form 2551Q (Percentage Tax) or 2550Q (VAT)',
            "Display BIR Certificate of Registration and Mayor's Permit in your premises",
            'Keep all original certificates in a waterproof document folder'
        ]
    },
    founder: {
        intro: 'Comprehensive registration guide for a growing business — includes employee benefit agencies and industry-specific permits.',
        total_cost: '₱2,500 – ₱8,000',
        total_time: '3 – 6 weeks',
        steps: [
            {
                num: 1, accent: '#E8420A', icon: 'fas fa-building',
                title: 'Choose Structure: DTI or SEC Registration',
                office: 'DTI (sole proprietorship) or SEC (partnership / corporation)',
                cost: '₱500 – ₱5,000',
                duration: '1–5 business days',
                requirements: [
                    'Valid IDs of all owners / incorporators',
                    'Articles of Partnership or Incorporation (SEC route)',
                    "By-laws for corporations; Treasurer's Affidavit for stock corps",
                    'Business name options — search SEC online first to avoid conflicts'
                ],
                where: 'bizname.dti.gov.ph | esec.gov.ph',
                tip: 'Choose SEC for partnerships and corporations — gives better credibility with banks, investors, and large suppliers. DTI is simpler and faster for sole proprietors.'
            },
            {
                num: 2, accent: '#6366F1', icon: 'fas fa-map-marker-alt',
                title: 'Barangay Business Clearance',
                office: 'Barangay Hall at your primary business address',
                cost: '₱200 – ₱800',
                duration: '1–2 days',
                requirements: [
                    'DTI or SEC Certificate',
                    'Community Tax Certificate (Cedula)',
                    'Lease contract or proof of ownership',
                    'Valid IDs of all owners'
                ],
                where: 'Your local Barangay Hall',
                tip: "Some LGUs have unified processing — barangay clearance is included in the Mayor's Permit application. Ask your BPLO first."
            },
            {
                num: 3, accent: '#F5A500', icon: 'fas fa-landmark',
                title: "Mayor's Permit / Business License",
                office: 'City or Municipal Hall — BPLO',
                cost: '₱1,000 – ₱8,000 (varies by LGU and capitalization)',
                duration: '3–7 business days',
                requirements: [
                    'DTI or SEC Certificate',
                    'Barangay Business Clearance',
                    'Lease contract or land title',
                    'Fire Safety Inspection Certificate (FSIC)',
                    'Sanitary Permit',
                    'Zoning Clearance (from City Planning Office)'
                ],
                where: 'BPLO, City/Municipal Hall',
                tip: 'Cebu, Davao, and Makati have fully online BPLO systems — apply online to save time. Some LGUs issue 3-year permits for qualifying businesses.'
            },
            {
                num: 4, accent: '#10B981', icon: 'fas fa-receipt',
                title: 'BIR Registration + Books of Account',
                office: 'Bureau of Internal Revenue — RDO',
                cost: '₱530 registration + ₱200–500 for Books of Account',
                duration: '1–3 business days',
                requirements: [
                    'DTI or SEC Certificate',
                    "Mayor's Permit",
                    'Lease contract / proof of address',
                    'Valid IDs',
                    'BIR Form 1901 (sole prop) or Form 1903 (corp/partnership)',
                    'Books of Account: Journal, Ledger, Cash Receipts, Disbursements'
                ],
                where: 'BIR RDO with jurisdiction over your business address',
                tip: 'Get ATP (Authority to Print) for official receipts at the same visit. RDO number matters — use the one that covers your principal business address.'
            },
            {
                num: 5, accent: '#8B5CF6', icon: 'fas fa-users',
                title: 'SSS, PhilHealth & Pag-IBIG Employer Registration',
                office: 'SSS, PhilHealth, and HDMF (Pag-IBIG) offices',
                cost: '₱0 registration (monthly contributions apply)',
                duration: '3–5 business days per agency',
                requirements: [
                    'BIR Certificate of Registration',
                    "Mayor's Permit",
                    'List of employees with their existing SSS/PhilHealth/Pag-IBIG numbers',
                    'Employment contracts or appointment letters',
                    'Payroll records'
                ],
                where: 'my.sss.gov.ph | eregister.philhealth.gov.ph | pagibigfund.gov.ph',
                tip: 'Required for any business with at least 1 regular employee. Employer share: SSS ~9.5%, PhilHealth 2.5%, Pag-IBIG ₱100/month per employee.'
            },
            {
                num: 6, accent: '#EF4444', icon: 'fas fa-certificate',
                title: 'Industry-Specific Permits',
                office: 'Varies by industry (FDA, DOH, LTO, LTFRB, DTI-CPG, etc.)',
                cost: '₱500 – ₱10,000+ per permit',
                duration: '1 week – 3 months',
                requirements: ['Varies by industry — see tip for details'],
                where: 'Specific regulatory agency office or online portal',
                tip: 'Food/Beverages: FDA License (fda.gov.ph) | Pharmacy: FDA Drug Outlet License | Construction: PCAB License | Transport: LTFRB Franchise | Healthcare: DOH / PRC License'
            }
        ],
        reminders: [
            "Renew Mayor's Permit, Barangay Clearance, and FSIC every January",
            'Pay SSS, PhilHealth, and Pag-IBIG employer contributions monthly before deadline',
            'File quarterly BIR returns (2551Q for % Tax or 2550Q for VAT)',
            'File Annual ITR (BIR Form 1701) before April 15 each year',
            'Keep official receipts and invoices for at least 3 years — BIR audit window',
            'Post required government certifications in a visible area of your premises'
        ]
    },
    complete: {
        intro: 'Professional-grade registration covering all permits, employee agencies, IP protection, and a full annual compliance calendar.',
        total_cost: '₱4,000 – ₱18,000',
        total_time: '4 – 8 weeks (IP registration: up to 18 months)',
        steps: [
            {
                num: 1, accent: '#E8420A', icon: 'fas fa-sitemap',
                title: 'Choose Optimal Business Structure',
                office: 'DTI (sole prop) | SEC (partnership, OPC, corporation)',
                cost: '₱500 – ₱5,000',
                duration: '1–5 business days',
                requirements: [
                    'Valid IDs of all incorporators/partners',
                    'Articles of Incorporation and By-laws (for corporation)',
                    "One Person Corporation (OPC) Application (single-owner, limited liability)",
                    "Treasurer's Affidavit and bank certificate of deposit"
                ],
                where: 'esec.gov.ph (online) | SEC main office for manual filing',
                tip: "An OPC offers limited liability without needing a partner — ideal for entrepreneurs who want sole ownership with corporate protection."
            },
            {
                num: 2, accent: '#6366F1', icon: 'fas fa-map-marker-alt',
                title: 'Barangay Business Clearance',
                office: 'Barangay Hall at your primary business address',
                cost: '₱200 – ₱1,000',
                duration: '1–2 days',
                requirements: [
                    'DTI or SEC Certificate of Registration',
                    'Community Tax Certificate',
                    'Notarized Lease Contract or Land Title',
                    'Valid ID of authorized representative'
                ],
                where: 'Barangay Hall',
                tip: 'For businesses with multiple branches, get a barangay clearance for each location from their respective barangay halls.'
            },
            {
                num: 3, accent: '#F5A500', icon: 'fas fa-landmark',
                title: "Mayor's Permit / Business License",
                office: 'City or Municipal Hall — BPLO',
                cost: '₱1,500 – ₱10,000+ (per LGU and capitalization)',
                duration: '3–7 business days',
                requirements: [
                    'DTI or SEC Certificate',
                    'Barangay Business Clearance',
                    'Notarized Lease Contract or Land Title',
                    'Fire Safety Inspection Certificate (BFP)',
                    'Sanitary Permit',
                    'Zoning Clearance',
                    'Environmental Compliance Certificate (if applicable)'
                ],
                where: "BPLO / City Hall — check your LGU's official website for online application",
                tip: "Save a digital copy of the approved permit for insurance and supplier accreditation requirements. Some cities offer 3-year permits to qualifying businesses."
            },
            {
                num: 4, accent: '#10B981', icon: 'fas fa-receipt',
                title: 'BIR Registration + Books + Authority to Print',
                office: 'Bureau of Internal Revenue — Revenue District Office',
                cost: '₱530 + ₱500–1,000 for books + ₱300–800 ATP fee',
                duration: '1–3 business days',
                requirements: [
                    'SEC or DTI Certificate',
                    "Mayor's Permit",
                    'Lease contract',
                    'Valid ID',
                    'BIR Form 1901 (sole prop) or 1903 (corp)',
                    'Books of Account: Journal, Ledger, Cash Receipts, Cash Disbursements'
                ],
                where: 'BIR RDO or orus.bir.gov.ph',
                tip: 'Enroll in BIR eFPS (Electronic Filing and Payment System) for convenient online tax filing. Large-volume businesses must use eFPS — register early to avoid compliance issues.'
            },
            {
                num: 5, accent: '#8B5CF6', icon: 'fas fa-users',
                title: 'SSS, PhilHealth & Pag-IBIG Employer Registration',
                office: 'SSS, PhilHealth, HDMF (Pag-IBIG)',
                cost: '₱0 registration (monthly contributions required)',
                duration: '3–5 business days per agency',
                requirements: [
                    'BIR Certificate of Registration',
                    "Mayor's Permit",
                    'Employee data forms (SS-1, PMRF, MDF)',
                    'Employment contracts',
                    'Payroll records'
                ],
                where: 'my.sss.gov.ph | eregister.philhealth.gov.ph | pagibigfund.gov.ph',
                tip: 'Set up payroll software early to automate deductions. Late remittance penalties: SSS 3%/month, PhilHealth 2%/month — these compound fast.'
            },
            {
                num: 6, accent: '#EF4444', icon: 'fas fa-certificate',
                title: 'Industry-Specific Permits & Accreditations',
                office: 'FDA, DOH, LTO, LTFRB, PCAB, DTI-CPG, TESDA, etc.',
                cost: '₱1,000 – ₱15,000+ per permit',
                duration: '2 weeks – 3 months',
                requirements: [
                    'Industry-specific documentation (see tip)',
                    'Proof of qualifications for licensed professions',
                    "Mayor's Permit and BIR COR",
                    'Facility inspection certificates'
                ],
                where: 'Specific regulatory agency (online or in-person)',
                tip: 'Food: FDA Center for Food Regulation | Pharmacy: FDA Drug Outlet License | Transport: LTFRB Franchise | Medical: DOH/PRC | Construction: PCAB | Manpower: DOLE'
            },
            {
                num: 7, accent: '#0F1F3D', icon: 'fas fa-trademark',
                title: 'Trademark & Intellectual Property Registration',
                office: 'Intellectual Property Office of the Philippines (IPOPHL)',
                cost: '₱1,620 – ₱5,600 per class (depends on applicant type)',
                duration: '12–18 months for full registration',
                requirements: [
                    'Completed trademark application form',
                    'Brand name and/or logo specimen or drawing',
                    'List of goods or services in Nice Classification',
                    'Valid ID or corporate documents',
                    'Proof of use (if claiming prior use)'
                ],
                where: 'iponline.ipophil.gov.ph or IPOPHL office, Taguig City',
                tip: 'File early — your priority date is your filing date, not your approval date. A trademark lasts 10 years and is renewable. Protect your brand name, logo, and tagline separately.'
            },
            {
                num: 8, accent: '#D97706', icon: 'fas fa-calendar-check',
                title: 'Annual Compliance & Renewal Schedule',
                office: 'Multiple agencies — ongoing annual obligation',
                cost: '₱2,000 – ₱15,000/year (all agencies combined)',
                duration: 'Ongoing — multiple deadlines per year',
                requirements: [
                    'Audited Financial Statements (AFS) — due March 31',
                    'Annual Income Tax Return (ITR) — due April 15',
                    'SEC Annual Report (within 120 days of fiscal year end)',
                    "Mayor's Permit renewal (January)",
                    'BIR Annual Registration renewal (January 31)'
                ],
                where: 'BIR, SEC, LGU, SSS, PhilHealth, Pag-IBIG',
                tip: 'Use a compliance calendar or hire a CPA/bookkeeper to track all deadlines. Late BIR filing: 25% surcharge + 12% annual interest — these compound quickly.'
            }
        ],
        reminders: [
            "Set a December reminder to prepare documents for January permit renewals",
            'File and pay BIR taxes on time — late filing incurs 25% surcharge + 12% annual interest',
            'Submit SEC Annual Report within 120 days of fiscal year end',
            'Conduct an internal annual compliance audit with your CPA or business lawyer',
            'Update your business registration whenever you change address, add branches, or change business name',
            'Back up all government-issued documents digitally (Google Drive or cloud storage)'
        ]
    }
};
PERMIT_DATA.custom = PERMIT_DATA.complete;

// ── Materials & Equipment Data ────────────────────────────────────────────────
const EQUIPMENT_DATA = {
    starter: {
        intro: 'Lean startup equipment list — focus on the essentials to minimize upfront costs while launching professionally.',
        total_low: '₱35,000',
        total_high: '₱130,000',
        note: 'Consider second-hand equipment to reduce startup costs by 30–50%.',
        categories: [
            {
                name: 'Computing & Communications',
                icon: 'fas fa-laptop', color: '#E8420A',
                items: [
                    { name: 'Laptop or desktop computer', range: '₱18,000 – ₱45,000', note: 'Bookkeeping, social media, admin tasks' },
                    { name: 'Mobile phone (business number)', range: '₱5,000 – ₱15,000', note: 'Customer communication and GCash' },
                    { name: 'Internet connection (DSL/fiber)', range: '₱999 – ₱1,999/month', note: 'Required for online selling and social media' }
                ]
            },
            {
                name: 'Cash Handling & Payments',
                icon: 'fas fa-cash-register', color: '#6366F1',
                items: [
                    { name: 'Cash register or lockbox with key', range: '₱1,500 – ₱5,000', note: 'Basic cash management and security' },
                    { name: 'GCash / Maya QR display stand', range: '₱0 – ₱500', note: 'Free to register; essential for cashless payments' },
                    { name: 'Thermal receipt printer', range: '₱2,500 – ₱8,000', note: 'For BIR official receipts and invoices' }
                ]
            },
            {
                name: 'Storage & Display',
                icon: 'fas fa-boxes', color: '#F5A500',
                items: [
                    { name: 'Metal display shelves / racks', range: '₱2,000 – ₱12,000', note: 'Product display and organization' },
                    { name: 'Storage bins and labeled containers', range: '₱500 – ₱3,000', note: 'Organized inventory storage' },
                    { name: 'Weighing scale (if selling by weight)', range: '₱800 – ₱3,500', note: 'Required for grocery, dried goods, etc.' }
                ]
            },
            {
                name: 'Signage & Marketing Materials',
                icon: 'fas fa-sign', color: '#10B981',
                items: [
                    { name: 'Tarpaulin signage (3×4 ft, outdoor)', range: '₱300 – ₱1,500', note: 'Primary storefront visual marketing' },
                    { name: 'Business cards (500 pcs)', range: '₱300 – ₱800', note: 'Networking and referrals' },
                    { name: 'Flyers / leaflets (1,000 pcs)', range: '₱800 – ₱2,500', note: 'Grand opening and local promotions' }
                ]
            }
        ],
        sourcing_tips: [
            'Buy second-hand laptops and equipment from OLX, Shopee, or Facebook Marketplace to save 30–50%',
            'Check Divisoria (Manila), Carbon Market (Cebu), or Bankerohan (Davao) for affordable supplies and fixtures',
            'Borrow non-critical equipment from family or friends for the first 3 months before buying',
            'Prioritize cash-generating equipment first: display fixtures, POS, and signage before office equipment'
        ]
    },
    founder: {
        intro: 'Professional equipment for a growing operation — includes full POS, security, and staff workstations.',
        total_low: '₱120,000',
        total_high: '₱400,000',
        note: 'Phase your purchases: essentials at launch, support equipment in Months 2–3 from early revenue.',
        categories: [
            {
                name: 'Computing & Workstations',
                icon: 'fas fa-desktop', color: '#E8420A',
                items: [
                    { name: 'Business laptops / desktops (2 units)', range: '₱36,000 – ₱90,000', note: 'Owner + staff workstation' },
                    { name: 'Business-grade router + UPS backup', range: '₱3,500 – ₱10,000', note: 'Stable internet for POS and admin operations' },
                    { name: 'Network printer / scanner (shared)', range: '₱5,000 – ₱18,000', note: 'Documents, invoices, contracts' }
                ]
            },
            {
                name: 'POS & Payment System',
                icon: 'fas fa-cash-register', color: '#6366F1',
                items: [
                    { name: 'Full POS system (hardware + software)', range: '₱15,000 – ₱50,000', note: 'Integrated sales and inventory tracking' },
                    { name: 'Barcode scanner', range: '₱1,200 – ₱4,000', note: 'Fast and accurate product checkout' },
                    { name: 'Digital payment terminal (GCash/Maya/card)', range: '₱0 – ₱5,000', note: 'Enables e-wallet and credit card payments' }
                ]
            },
            {
                name: 'Security & Safety',
                icon: 'fas fa-shield-alt', color: '#EF4444',
                items: [
                    { name: 'CCTV security cameras (4-cam system)', range: '₱8,000 – ₱25,000', note: 'Theft deterrence and staff monitoring' },
                    { name: 'Padlocks and door alarm', range: '₱1,500 – ₱5,000', note: 'Perimeter access control' },
                    { name: 'Fire extinguisher (BFP-required)', range: '₱1,500 – ₱3,500', note: 'Mandatory for Fire Safety Inspection Certificate' }
                ]
            },
            {
                name: 'Furniture & Office Setup',
                icon: 'fas fa-chair', color: '#F5A500',
                items: [
                    { name: 'Office desk and ergonomic chairs', range: '₱5,000 – ₱20,000', note: 'Owner and admin staff workspace' },
                    { name: 'Filing cabinet or document safe', range: '₱3,000 – ₱12,000', note: 'Legal documents, permits, and petty cash' },
                    { name: 'Customer waiting area chairs', range: '₱2,000 – ₱8,000', note: 'For service businesses with walk-in clients' }
                ]
            },
            {
                name: 'Display, Storage & Operations',
                icon: 'fas fa-boxes', color: '#10B981',
                items: [
                    { name: 'Modular display shelving system', range: '₱15,000 – ₱60,000', note: 'Expandable, professional product display fixtures' },
                    { name: 'Commercial refrigerator / freezer', range: '₱12,000 – ₱40,000', note: 'For perishables, beverages, or cold storage needs' },
                    { name: 'Backroom storage shelving + labels', range: '₱3,000 – ₱10,000', note: 'Organized inventory management system' }
                ]
            },
            {
                name: 'Marketing & Branding',
                icon: 'fas fa-bullhorn', color: '#D97706',
                items: [
                    { name: 'Professional store signage (illuminated)', range: '₱8,000 – ₱35,000', note: 'Night visibility and brand presence 24/7' },
                    { name: 'Product photography setup (ring light + backdrop)', range: '₱2,500 – ₱8,000', note: 'For Shopee, Lazada, and social media listings' },
                    { name: 'Branded packaging (boxes, bags, 1,000 pcs min)', range: '₱3,000 – ₱12,000', note: 'MOQ pricing — buy at launch volume' }
                ]
            }
        ],
        sourcing_tips: [
            'Purchase POS systems from established PH vendors: StoreHub, CliQQ, or PayMongo for local support and warranty',
            "Source display fixtures from SM Hypermarket's trade section, Ace Hardware, or fixture suppliers in Divisoria",
            'Get CCTV systems installed by accredited security firms — they handle permits and warranty claims',
            'Apply for MSME equipment loans from SB Finance, LANDBANK, or Pag-IBIG MSME fund to spread equipment costs'
        ]
    },
    complete: {
        intro: 'Full professional setup for a serious business — complete technology stack, enterprise security, and scalable infrastructure.',
        total_low: '₱350,000',
        total_high: '₱1,200,000',
        note: 'Phase purchases over 3 months. Revenue-generating equipment in Month 1, support infrastructure in Months 2–3.',
        categories: [
            {
                name: 'Full Technology Suite',
                icon: 'fas fa-server', color: '#E8420A',
                items: [
                    { name: 'Business laptops / desktops (3–5 units)', range: '₱90,000 – ₱250,000', note: 'Full team workstations with business-grade specs' },
                    { name: 'Enterprise network switch + router', range: '₱8,000 – ₱25,000', note: 'Stable LAN for all workstations and POS terminals' },
                    { name: 'NAS / cloud backup server', range: '₱10,000 – ₱35,000', note: 'Business data protection and daily backup redundancy' }
                ]
            },
            {
                name: 'Advanced POS & Inventory System',
                icon: 'fas fa-cash-register', color: '#6366F1',
                items: [
                    { name: 'Multi-terminal POS + inventory management module', range: '₱35,000 – ₱120,000', note: 'Real-time inventory sync + sales analytics dashboard' },
                    { name: 'Barcode printer + scanner set', range: '₱8,000 – ₱25,000', note: 'In-house barcoding for custom SKUs' },
                    { name: 'Full payment gateway integration', range: '₱5,000 – ₱20,000', note: 'GCash, Maya, credit card, BancNet, and bank transfer' }
                ]
            },
            {
                name: 'Enterprise Security System',
                icon: 'fas fa-shield-alt', color: '#EF4444',
                items: [
                    { name: 'IP CCTV system (8–16 cameras + DVR/NVR)', range: '₱25,000 – ₱80,000', note: 'Full-store coverage with remote mobile monitoring' },
                    { name: 'Biometric time & attendance system', range: '₱5,000 – ₱15,000', note: 'Employee attendance tracking with payroll integration' },
                    { name: 'Alarm + electronic door access control', range: '₱15,000 – ₱45,000', note: 'Authorized access control and intrusion alert' }
                ]
            },
            {
                name: 'Professional Interior & Furniture',
                icon: 'fas fa-store', color: '#F5A500',
                items: [
                    { name: 'Custom store interior design + fixtures', range: '₱80,000 – ₱350,000', note: 'Custom shelving, counters, finishings, and flooring' },
                    { name: 'Ergonomic office furniture set', range: '₱20,000 – ₱60,000', note: 'Owner, manager, and admin area full setup' },
                    { name: 'Staff break room / pantry equipment', range: '₱8,000 – ₱25,000', note: 'Microwave, mini-fridge, dining table, and chairs' }
                ]
            },
            {
                name: 'Operations & Logistics',
                icon: 'fas fa-truck', color: '#10B981',
                items: [
                    { name: 'Delivery vehicle (motorcycle or multicab)', range: '₱80,000 – ₱350,000', note: 'For delivery operations; consider lease-to-own' },
                    { name: 'Commercial warehouse shelving system', range: '₱20,000 – ₱80,000', note: 'Heavy-duty, height-adjustable industrial racks' },
                    { name: 'Industrial packaging machine (if applicable)', range: '₱15,000 – ₱80,000', note: 'Heat sealer, shrink wrapper, or auto-fill machine' }
                ]
            },
            {
                name: 'Marketing & Digital Presence',
                icon: 'fas fa-camera', color: '#3B82F6',
                items: [
                    { name: 'Professional product photography setup', range: '₱8,000 – ₱30,000', note: 'Lightbox, backdrop, ring lights, and tripod kit' },
                    { name: 'LED illuminated exterior signage', range: '₱25,000 – ₱90,000', note: 'Lighted signboard for 24/7 brand visibility' },
                    { name: 'Digital display screen / menu board', range: '₱8,000 – ₱35,000', note: 'For restaurants, clinics, and service counters' }
                ]
            }
        ],
        sourcing_tips: [
            'Get 3 competitive quotations for all major purchases — especially custom interior fitout and CCTV systems',
            'Lease delivery vehicles instead of buying outright — Orix Metro Leasing or rent-to-own schemes reduce upfront capital',
            'Source technology from accredited resellers: Gilmore IT Hub, PC Express, or SM Cyberzone for warranty coverage',
            'Apply for MSME capital equipment loans: LANDBANK iCall, DBP SME Loan, or SB Finance Equipment Loan',
            'Consider rent-to-own arrangements for large equipment like commercial refrigerators and POS systems',
            'Explore SMEDA (SB Corp) programs for subsidized business equipment grants and MSME development support'
        ]
    }
};
EQUIPMENT_DATA.custom = EQUIPMENT_DATA.complete;

// ── Render: Permits & Licenses ────────────────────────────────────────────────
function renderPermits(product) {
    const container = document.getElementById('permits-list');
    if (!container) return;
    const data = PERMIT_DATA[product.tier] || PERMIT_DATA.starter;

    container.innerHTML = `
        <div class="permit-summary">
            <div class="permit-summary-item">
                <span><i class="fas fa-coins" style="color:var(--amber);margin-right:0.3rem;"></i>Estimated Total Cost</span>
                <strong>${data.total_cost}</strong>
            </div>
            <div class="permit-summary-item">
                <span><i class="fas fa-clock" style="color:var(--orange);margin-right:0.3rem;"></i>Processing Time</span>
                <strong>${data.total_time}</strong>
            </div>
            <div class="permit-summary-item">
                <span><i class="fas fa-list-ol" style="color:var(--navy);margin-right:0.3rem;"></i>Steps Included</span>
                <strong>${data.steps.length} registration steps</strong>
            </div>
        </div>
        <p class="permit-intro">${data.intro}</p>
        <div class="permit-steps">
            ${data.steps.map(s => `
                <div class="permit-step">
                    <div class="permit-step-left">
                        <div class="permit-step-num" style="background:${s.accent};">
                            <i class="${s.icon}"></i>
                        </div>
                        <div class="permit-step-line"></div>
                    </div>
                    <div class="permit-step-body">
                        <div class="permit-step-head">
                            <h4 class="permit-step-title">Step ${s.num}: ${s.title}</h4>
                            <div class="permit-meta">
                                <span class="permit-cost-badge"><i class="fas fa-coins"></i> ${s.cost}</span>
                                <span class="permit-time-badge"><i class="fas fa-clock"></i> ${s.duration}</span>
                            </div>
                        </div>
                        <p class="permit-office"><i class="fas fa-building" style="color:${s.accent};margin-right:0.3rem;flex-shrink:0;"></i>${s.office}</p>
                        <div class="permit-docs">
                            <strong>Documents Required:</strong>
                            <ul>${s.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
                        </div>
                        <p class="permit-where"><i class="fas fa-map-pin" style="color:${s.accent};margin-right:0.3rem;flex-shrink:0;margin-top:2px;"></i>${s.where}</p>
                        <div class="permit-tip">
                            <i class="fas fa-lightbulb" style="color:var(--amber);flex-shrink:0;margin-top:2px;"></i>
                            <span><strong>Pro Tip:</strong> ${s.tip}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="permit-reminders">
            <h4><i class="fas fa-bell" style="color:var(--amber);margin-right:0.4rem;"></i>Annual Compliance Reminders</h4>
            <ul>
                ${data.reminders.map(r => `
                    <li><i class="fas fa-check-circle" style="color:#10B981;flex-shrink:0;margin-top:2px;"></i>${r}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

// ── Render: Materials & Equipment ─────────────────────────────────────────────
function renderEquipment(product) {
    const container = document.getElementById('equipment-list');
    if (!container) return;
    const data = EQUIPMENT_DATA[product.tier] || EQUIPMENT_DATA.starter;

    container.innerHTML = `
        <div class="equip-summary">
            <div class="equip-summary-item">
                <span><i class="fas fa-coins" style="color:var(--amber);margin-right:0.3rem;"></i>Estimated Equipment Budget</span>
                <strong>${data.total_low} – ${data.total_high}</strong>
            </div>
            <div class="equip-summary-item">
                <span><i class="fas fa-layer-group" style="color:var(--orange);margin-right:0.3rem;"></i>Equipment Categories</span>
                <strong>${data.categories.length} categories</strong>
            </div>
        </div>
        <p class="equip-intro">${data.intro}</p>
        ${data.note ? `<p class="equip-note"><i class="fas fa-info-circle"></i> ${data.note}</p>` : ''}
        <div class="equip-grid">
            ${data.categories.map(cat => `
                <div class="equip-category-card">
                    <div class="equip-cat-header">
                        <div class="equip-cat-icon" style="background:${cat.color}1A;color:${cat.color};">
                            <i class="${cat.icon}"></i>
                        </div>
                        <h4 class="equip-cat-name">${cat.name}</h4>
                    </div>
                    <div class="equip-items">
                        ${cat.items.map(item => `
                            <div class="equip-item">
                                <div class="equip-item-info">
                                    <span class="equip-item-name">${item.name}</span>
                                    <span class="equip-item-note">${item.note}</span>
                                </div>
                                <span class="equip-item-cost">${item.range}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="equip-sourcing">
            <h4><i class="fas fa-map-marked-alt" style="color:var(--orange);margin-right:0.4rem;"></i>Sourcing & Procurement Tips</h4>
            <ul>
                ${data.sourcing_tips.map(t => `
                    <li><i class="fas fa-arrow-right" style="color:var(--orange);flex-shrink:0;margin-top:2px;"></i>${t}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);
    if (productId) {
        loadProductDetails(productId);
    } else {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = '<p style="color:var(--text-muted);">Product not found. <a href="shop.html" style="color:var(--orange);">Browse all products.</a></p>';
    }
});

function loadProductDetails(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = '<p style="color:var(--text-muted);">Product not found. <a href="shop.html" style="color:var(--orange);">Browse all products.</a></p>';
        return;
    }

    const breadcrumb = document.getElementById('product-name-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = product.name;

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = product.name + ' - Negosyo Plan';

    const productImg = document.getElementById('product-img');
    if (productImg) { productImg.src = product.image; productImg.alt = product.name; }

    const titleH = document.getElementById('product-title');
    if (titleH) titleH.textContent = product.name;

    const priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = window.NegosyoPlan.formatPrice(product.price);

    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = product.description;

    const ratingEl = document.getElementById('product-rating');
    if (ratingEl) ratingEl.innerHTML = window.NegosyoPlan.generateStars(product.rating) + ` <span>${product.rating} (${product.reviews} reviews)</span>`;

    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            window.Cart.addToCart(product.id);
        });
    }

    const featureList = document.getElementById('feature-list');
    if (featureList) {
        featureList.innerHTML = product.features.map(f => `
            <div class="product-feature">
                <i class="${f.icon}"></i>
                <span style="font-size:0.88rem;color:var(--text-muted);">${f.text}</span>
            </div>
        `).join('');
    }

    const methodList = document.getElementById('methodology-list');
    if (methodList) {
        methodList.innerHTML = product.methodology.map((m, i) => `
            <article class="methodology-card">
                <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem;">
                    <span style="width:28px;height:28px;border-radius:50%;background:var(--orange);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;flex-shrink:0;">${i + 1}</span>
                    <h4 style="font-size:0.93rem;color:var(--navy);">${m.step}</h4>
                </div>
                <p style="font-size:0.83rem;color:var(--text-muted);">${m.desc}</p>
            </article>
        `).join('');
    }

    renderFrameworks(product);
    renderPermits(product);
    renderEquipment(product);

    const relatedList = document.getElementById('related-products');
    if (relatedList) {
        const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
        relatedList.innerHTML = related.map(p => `
            <article class="product-card">
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    <div class="pdf-badge">Blueprint OS</div>
                </div>
                <h3>${p.name}</h3>
                <p class="price">${window.NegosyoPlan.formatPrice(p.price)}</p>
                <p>${p.description.substring(0, 90)}...</p>
                <div class="product-actions">
                    <a href="product.html?id=${p.id}" class="button">View Details</a>
                </div>
            </article>
        `).join('');
    }
}

function renderFrameworks(product) {
    const container = document.getElementById('frameworks-list');
    if (!container) return;

    const frameworks = FRAMEWORK_DATA[product.tier] || FRAMEWORK_DATA.starter;

    const badgeColors = { Foundation: '#E8420A', Essential: '#F5A500', Advanced: '#6366F1', Pro: '#0F1F3D' };

    container.innerHTML = `
        <div class="framework-grid">
            ${frameworks.map(fw => `
                <div class="framework-card">
                    <div class="framework-card-header">
                        <div class="framework-icon" style="background:${fw.bg}20;color:${fw.bg};">
                            <i class="${fw.icon}"></i>
                        </div>
                        <div>
                            <h4>${fw.title}</h4>
                            <span class="framework-badge" style="background:${badgeColors[fw.badge] || '#E8420A'}22;color:${badgeColors[fw.badge] || '#E8420A'};">${fw.badge}</span>
                        </div>
                    </div>
                    <ul>
                        ${fw.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
}
