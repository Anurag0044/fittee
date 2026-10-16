import { PrismaClient, AdminRole, FitType, ProductStatus, ProductBadge, BannerSlot, JournalStatus, OrderStatus, PaymentMethod, PaymentStatus, DispatchState } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting FITTEE database seeding...');

  // 1. Super Admin
  const adminPasswordHash = await bcrypt.hash('Admin@Fittee2026', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@fittee.in' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@fittee.in',
      passwordHash: adminPasswordHash,
      role: AdminRole.SUPER_ADMIN,
      twoFactorEnabled: false,
      permissions: ['ALL'],
    },
  });
  console.log(` Created Super Admin: ${admin.email}`);

  // 2. Categories
  const categoriesData = [
    {
      name: 'Oversized Streetwear',
      slug: 'oversized-streetwear',
      subtitle: '240 GSM Heavyweight French Terry',
      storyExcerpt: 'Modern relaxed boxy silhouettes infused with indigenous motif line-art.',
      iconMotif: 'sparkles',
      displayOrder: 1,
    },
    {
      name: 'Classic Heritage',
      slug: 'classic-heritage',
      subtitle: '200 GSM Combed Bio-Washed Cotton',
      storyExcerpt: 'Timeless regular fit essentials tailored for everyday comfort and cultural expression.',
      iconMotif: 'crown',
      displayOrder: 2,
    },
    {
      name: 'Sohrai & Khovar Collection',
      slug: 'sohrai-khovar',
      subtitle: 'GI-Tagged Murals of Hazaribagh',
      storyExcerpt: 'Honoring centuries-old matriarchal cave art translated onto organic sustainable cotton.',
      iconMotif: 'brush',
      displayOrder: 3,
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(c);
  }
  console.log(` Seeded ${categories.length} categories.`);

  // 3. Products (The 10 T-Shirts from the Storefront)
  const productsData = [
    {
      displayId: 1,
      title: 'Sohrai Spirit Tee',
      slug: 'sohrai-spirit',
      categoryId: categories[2].id,
      fitType: FitType.REGULAR_FIT,
      badge: ProductBadge.NEW,
      sellingPrice: 799,
      originalMrp: 1199,
      discountPercent: 33,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Inspired by Hazaribagh Sohrai painting, depicting harmonious forest animals and sacred mud wall rituals.',
      fabricDetails: '200 GSM 100% Combed Compact Cotton. Pre-shrunk, bio-washed with zero pilling.',
      rating: 4.9,
      reviewsCount: 128,
      colors: [
        { name: 'Ecru Cream', hex: '#E8DFC8' },
        { name: 'Earth Brown', hex: '#7A4B2A' },
        { name: 'Slate Teal', hex: '#2F4F4F' },
      ],
    },
    {
      displayId: 2,
      title: 'Adivasi Roots Tee',
      slug: 'adivasi-roots',
      categoryId: categories[0].id,
      fitType: FitType.OVERSIZED_FIT,
      badge: ProductBadge.BESTSELLER,
      sellingPrice: 899,
      originalMrp: 1299,
      discountPercent: 31,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Bold geometric tribal glyphs celebrating the unyielding spirit and deep botanical reverence of Jharkhand.',
      fabricDetails: '240 GSM Heavyweight French Terry Cotton. Dropped shoulders, ribbed collar reinforcement.',
      rating: 4.8,
      reviewsCount: 215,
      colors: [
        { name: 'Deep Ochre', hex: '#CC7722' },
        { name: 'Charcoal Black', hex: '#1C1C1C' },
      ],
    },
    {
      displayId: 3,
      title: 'Hazaribagh Earth Tee',
      slug: 'hazaribagh-earth',
      categoryId: categories[0].id,
      fitType: FitType.OVERSIZED_FIT,
      badge: ProductBadge.FESTIVE_SPECIAL,
      sellingPrice: 999,
      originalMrp: 1499,
      discountPercent: 33,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Naturally tinted shades honoring the terra-cotta clay and mineral earths of Chotanagpur plateau.',
      fabricDetails: '240 GSM Heavyweight Terry. Reactive-dyed for permanent color saturation.',
      rating: 4.9,
      reviewsCount: 94,
      colors: [
        { name: 'Terracotta', hex: '#C86D51' },
        { name: 'Sand Beige', hex: '#D2B48C' },
      ],
    },
    {
      displayId: 4,
      title: 'Forest Tales Tee',
      slug: 'forest-tales',
      categoryId: categories[1].id,
      fitType: FitType.REGULAR_FIT,
      badge: null,
      sellingPrice: 749,
      originalMrp: 1099,
      discountPercent: 32,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Whimsical line illustrations of deer and sacred peacock motifs hiding within dense Sal forests.',
      fabricDetails: '200 GSM Ring-Spun Pure Cotton with high breathability for tropical weather.',
      rating: 4.7,
      reviewsCount: 67,
      colors: [
        { name: 'Moss Green', hex: '#4A5D4E' },
        { name: 'Ivory White', hex: '#FFFFF0' },
      ],
    },
    {
      displayId: 5,
      title: 'Karam Rhythm Tee',
      slug: 'karam-rhythm',
      categoryId: categories[0].id,
      fitType: FitType.OVERSIZED_FIT,
      badge: ProductBadge.BESTSELLER,
      sellingPrice: 899,
      originalMrp: 1299,
      discountPercent: 31,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Dancers uniting hand-in-hand around the sacred Karam bough, rhythmic drum beats immortalized in screen print.',
      fabricDetails: '240 GSM French Terry with ultra-soft carbon brushed finish.',
      rating: 5.0,
      reviewsCount: 142,
      colors: [
        { name: 'Midnight Navy', hex: '#1B263B' },
        { name: 'Harvest Gold', hex: '#DAA520' },
      ],
    },
    {
      displayId: 6,
      title: 'Karma Lines Tee',
      slug: 'karma-lines',
      categoryId: categories[1].id,
      fitType: FitType.REGULAR_FIT,
      badge: null,
      sellingPrice: 799,
      originalMrp: 1199,
      discountPercent: 33,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Minimalist tribal line strokes reflecting balance, cyclical karma, and harmony with flora.',
      fabricDetails: '200 GSM Combed Cotton with smooth micro-rib neckline.',
      rating: 4.6,
      reviewsCount: 48,
      colors: [
        { name: 'Pure Black', hex: '#000000' },
        { name: 'Warm Cream', hex: '#FDFBF7' },
      ],
    },
    {
      displayId: 7,
      title: 'Palash Stories Tee',
      slug: 'palash-stories',
      categoryId: categories[0].id,
      fitType: FitType.OVERSIZED_FIT,
      badge: ProductBadge.NEW,
      sellingPrice: 949,
      originalMrp: 1399,
      discountPercent: 32,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Captures the fiery red-orange blossom of Palash trees (Flame of the Forest) sweeping spring hillsides.',
      fabricDetails: '240 GSM Heavy Cotton Terry with high tensile double stitching.',
      rating: 4.9,
      reviewsCount: 88,
      colors: [
        { name: 'Flame Red', hex: '#E25822' },
        { name: 'Forest Shadow', hex: '#2B3A42' },
      ],
    },
    {
      displayId: 8,
      title: 'Rising Roots Tee',
      slug: 'rising-roots',
      categoryId: categories[1].id,
      fitType: FitType.REGULAR_FIT,
      badge: null,
      sellingPrice: 849,
      originalMrp: 1249,
      discountPercent: 32,
      status: ProductStatus.ACTIVE,
      artworkStory: 'A tribute to indigenous resilience and deep cultural heritage anchoring youth across generations.',
      fabricDetails: '200 GSM Combed Cotton, silicon-softened for luxury touch.',
      rating: 4.7,
      reviewsCount: 56,
      colors: [
        { name: 'Olive Drab', hex: '#556B2F' },
        { name: 'Heather Grey', hex: '#9E9E9E' },
      ],
    },
    {
      displayId: 9,
      title: 'Sarna Bloom Tee',
      slug: 'sarna-bloom',
      categoryId: categories[1].id,
      fitType: FitType.REGULAR_FIT,
      badge: null,
      sellingPrice: 799,
      originalMrp: 1199,
      discountPercent: 33,
      status: ProductStatus.ACTIVE,
      artworkStory: 'The sacred Sarna grove blooming with white Sal flowers during the vibrant Sarhul springtime festival.',
      fabricDetails: '200 GSM Bio-Washed Ring-Spun Cotton.',
      rating: 4.8,
      reviewsCount: 79,
      colors: [
        { name: 'Sal Blossom White', hex: '#F8F9FA' },
        { name: 'Clay Coral', hex: '#E07A5F' },
      ],
    },
    {
      displayId: 10,
      title: 'Tribal Horizon Tee',
      slug: 'tribal-horizon',
      categoryId: categories[0].id,
      fitType: FitType.OVERSIZED_FIT,
      badge: ProductBadge.BESTSELLER,
      sellingPrice: 999,
      originalMrp: 1499,
      discountPercent: 33,
      status: ProductStatus.ACTIVE,
      artworkStory: 'Panoramic horizon depicting traditional mud dwellings, sacred trees, and indigenous astronomy motifs.',
      fabricDetails: '240 GSM Heavy French Terry with anti-shrink stabilization.',
      rating: 5.0,
      reviewsCount: 184,
      colors: [
        { name: 'Dusk Charcoal', hex: '#212529' },
        { name: 'Burnt Sienna', hex: '#A0522D' },
      ],
    },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        displayId: p.displayId,
        title: p.title,
        slug: p.slug,
        categoryId: p.categoryId,
        fitType: p.fitType,
        badge: p.badge,
        sellingPrice: p.sellingPrice,
        originalMrp: p.originalMrp,
        discountPercent: p.discountPercent,
        status: p.status,
        artworkStory: p.artworkStory,
        fabricDetails: p.fabricDetails,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
      },
    });

    // Product Images
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: `/images/products/${p.slug}.jpg`,
          altText: `${p.title} Primary View`,
          isHero: true,
          displayOrder: 1,
        },
        {
          productId: product.id,
          url: `/images/products/${p.slug}.jpg`,
          altText: `${p.title} Detailed Texture View`,
          isHero: false,
          displayOrder: 2,
        },
      ],
      skipDuplicates: true,
    });

    // Product Variants for each color and size combination
    for (const color of p.colors) {
      for (const size of sizes) {
        const sku = `FIT-${p.slug.toUpperCase().slice(0, 4)}-${color.name.toUpperCase().slice(0, 3)}-${size}`;
        await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: {
            productId: product.id,
            sku,
            colorName: color.name,
            colorHex: color.hex,
            size,
            stock: 35,
            lowStockThreshold: 5,
          },
        });
      }
    }
  }
  console.log(` Seeded all 10 core T-shirts and variant matrix.`);

  // 4. Festive Banners
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(now.getDate() + 30);

  await prisma.festiveBanner.createMany({
    data: [
      {
        campaignName: 'Durga Puja & Karam Mahotsav Sale',
        slot: BannerSlot.HERO_BANNER,
        headline: 'Celebrate Jharkhand Heritage With 25% Off',
        subheadline: 'Handcrafted tribal prints on luxury 240 GSM heavyweight cotton.',
        ctaText: 'Explore Festive Collection',
        redirectUrl: '/#featured',
        linkedCouponCode: 'HERITAGE25',
        priority: 1,
        startDateTime: now,
        endDateTime: nextMonth,
        isActive: true,
      },
      {
        campaignName: 'Top Announcement Bar',
        slot: BannerSlot.ANNOUNCEMENT_BAR,
        headline: '⚡ Free Express Shipping Across India on Orders Above ₹999 • Handcrafted in Ranchi',
        redirectUrl: '/#featured',
        priority: 1,
        startDateTime: now,
        endDateTime: nextMonth,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log(' Seeded festive sales banners.');

  // 5. Cultural Journal Articles
  await prisma.journalPost.upsert({
    where: { slug: 'living-lines-of-sohrai' },
    update: {},
    create: {
      title: 'The Living Lines of Sohrai: Ancient Art Meets Modern Streetwear',
      slug: 'living-lines-of-sohrai',
      excerpt: 'How century-old mud wall paintings from Hazaribagh find new life in contemporary streetwear silhouettes.',
      body: `Sohrai art is deeply tied to harvest and cattle celebrations. Traditionally painted by women using natural pigments, red ochre, and chewed neem twigs, these murals depict the profound harmony between tribal communities and nature. At FITTEE, we translate these sacred geometries into wearable art, giving voice to indigenous stories without dilution.`,
      coverImage: '/images/fabrics/stacked-fabrics-hero.jpg',
      authorName: 'Sushila Marandi, Master Artisan',
      readingTimeMinutes: 4,
      categoryTags: ['Artisans', 'Sohrai Heritage', 'Sustainable Fashion'],
      status: JournalStatus.PUBLISHED,
      publishedAt: now,
    },
  });
  console.log(' Seeded cultural journal articles.');

  // 6. Seed Sample Customer & Admin Order Detail
  const customer = await prisma.customer.upsert({
    where: { email: 'aarav.sharma@example.com' },
    update: {},
    create: {
      customerCode: 'FIT-CUST-1049',
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+919876543210',
    },
  });

  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      fullName: 'Aarav Sharma',
      phone: '+919876543210',
      addressLine1: 'Flat 402, Green Glen Residency, Ashok Nagar',
      addressLine2: 'Road No. 4, Near Kadru Bridge',
      landmark: 'Near Kadru Bridge',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834002',
      isDefault: true,
      isServiceable: true,
    },
  });

  const firstProduct = await prisma.product.findFirst({ where: { slug: 'sohrai-spirit' } });
  if (firstProduct) {
    const order = await prisma.order.upsert({
      where: { orderNumber: 'FIT-2026-8942' },
      update: {},
      create: {
        orderNumber: 'FIT-2026-8942',
        customerId: customer.id,
        customerCode: customer.customerCode,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          landmark: address.landmark,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          isServiceable: true,
        },
        subtotal: 799,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 799,
        paymentMethod: PaymentMethod.RAZORPAY,
        paymentStatus: PaymentStatus.PAID,
        transactionId: 'pay_mock_184920491',
        status: OrderStatus.CONFIRMED,
        dispatchState: DispatchState.NOT_BOOKED,
        courierName: 'Ekart Logistics',
        internalNotes: ['Verified high priority customer inquiry', 'Packaging with commemorative bookmark'],
        items: {
          create: [
            {
              productId: firstProduct.id,
              productTitle: firstProduct.title,
              fitType: firstProduct.fitType,
              colorName: 'Ecru Cream',
              colorHex: '#E8DFC8',
              size: 'L',
              sku: 'FIT-SOHR-ECR-L',
              quantity: 1,
              unitPrice: 799,
              totalPrice: 799,
              thumbnail: '/images/products/sohrai-spirit.jpg',
            },
          ],
        },
        timeline: {
          create: [
            {
              status: OrderStatus.PLACED,
              actor: 'CUSTOMER',
              note: 'Order successfully placed via Razorpay checkout',
            },
            {
              status: OrderStatus.CONFIRMED,
              actor: 'SYSTEM',
              note: 'Payment signature verified. Inventory allocated.',
            },
          ],
        },
      },
    });
    console.log(` Seeded sample order ${order.orderNumber} for customer ${order.customerCode}`);
  }

  // 7. Page Locks
  await prisma.pageLockSetting.upsert({
    where: { routePath: '/*' },
    update: {},
    create: {
      routePath: '/*',
      mode: 'MAINTENANCE',
      isLocked: false,
      title: 'Storefront Online',
      message: 'All systems operational',
      contactEmail: 'contact@fittee.in',
    },
  });

  console.log('✅ FITTEE database seed completed successfully!');
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Seeding error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
