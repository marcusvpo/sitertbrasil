-- Migration: Atualizar imagens dos produtos com URLs da planilha Yampi
-- Execute no SQL Editor do Supabase Dashboard

-- CROSS POWER 2T
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661414);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/cross-power-2t-69d6955b17187-medium.jpg', 44661414, 0 FROM products WHERE yampi_id = 44661414;

-- CROSS POWER 4T 10W50
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661454);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/cross-power-4t-10w50-69d6991fb0bff-medium.jpg', 44661454, 0 FROM products WHERE yampi_id = 44661454;

-- CROSS POWER 4T 10W60
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661455);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/cross-power-4t-10w60-69d6999943b88-medium.png', 44661455, 0 FROM products WHERE yampi_id = 44661455;

-- TOP SPEED 15w50
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661456);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/top-speed-15w50-69d69a1c2462f-medium.png', 44661456, 0 FROM products WHERE yampi_id = 44661456;

-- GEAR OIL 10w30
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661457);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/gear-oil-10w30-69d69a650fdff-medium.png', 44661457, 0 FROM products WHERE yampi_id = 44661457;

-- RACING FORK OIL 2,5 W
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661458);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-25-w-69d69a9427976-medium.png', 44661458, 0 FROM products WHERE yampi_id = 44661458;

-- RACING FORK OIL 4 W
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661459);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-4-w-69d69b538fdd1-medium.png', 44661459, 0 FROM products WHERE yampi_id = 44661459;

-- RACING FORK OIL 5 W
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661460);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-5-w-69d69b82e9deb-medium.png', 44661460, 0 FROM products WHERE yampi_id = 44661460;

-- RACING FORK OIL 7,5 W
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661461);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-75-w-69d69bad043dc-medium.png', 44661461, 0 FROM products WHERE yampi_id = 44661461;

-- RACING FORK OIL 10 W
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661462);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-10-w-69d69bd3a2307-medium.png', 44661462, 0 FROM products WHERE yampi_id = 44661462;

-- RACING FORK OIL 15 W
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661463);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-15-w-69d69c10ab127-medium.png', 44661463, 0 FROM products WHERE yampi_id = 44661463;

-- RACING SHOCK OIL
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661464);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-shock-oil-69d69fdd3ebd8-medium.png', 44661464, 0 FROM products WHERE yampi_id = 44661464;

-- RACING SD-1 5L
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661465);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-sd-1-5l-69d69c5d4dae9-medium.png', 44661465, 0 FROM products WHERE yampi_id = 44661465;

-- COOLANT M3.0
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661466);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/coolant-m30-69d69cb4e688b-medium.png', 44661466, 0 FROM products WHERE yampi_id = 44661466;

-- MOTO CLEAN
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661467);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/moto-clean-69d69cf53e4e6-medium.png', 44661467, 0 FROM products WHERE yampi_id = 44661467;

-- POWER BRAKE CLEAN
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661468);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/power-brake-clean-69d69d38e14a7-medium.png', 44661468, 0 FROM products WHERE yampi_id = 44661468;

-- AIR FILTER OIL 206
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661469);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/air-filter-oil-206-69d69da2cdffe-medium.png', 44661469, 0 FROM products WHERE yampi_id = 44661469;

-- 4-STROKE 5W40
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661470);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/4-stroke-5w40-69d69dd9b7dd2-medium.png', 44661470, 0 FROM products WHERE yampi_id = 44661470;

-- 4-STROKE 10W40
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661471);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/4-stroke-10w40-69d69e034d4b5-medium.png', 44661471, 0 FROM products WHERE yampi_id = 44661471;

-- 4-STROKE 15W50
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661472);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/4-stroke-15w50-69d69e501583f-medium.png', 44661472, 0 FROM products WHERE yampi_id = 44661472;

-- 4-STROKE 20W50
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661473);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/4-stroke-20w50-69d69ea1cd41f-medium.png', 44661473, 0 FROM products WHERE yampi_id = 44661473;

-- FETT 2000 - 850G
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661474);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/fett-2000-850g-69d69ef4efa0f-medium.jpg', 44661474, 0 FROM products WHERE yampi_id = 44661474;

-- FETT 3000 - 850G
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661475);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/fett-3000-850g-69d69f4840295-medium.png', 44661475, 0 FROM products WHERE yampi_id = 44661475;

-- GREASE GUN
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661476);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/grease-gun-69d94850b4566-medium.png', 44661476, 0 FROM products WHERE yampi_id = 44661476;

-- KTM RACING 4T 20W60
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661477);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/ktm-racing-4t-20w60-69d69f89beb9c-medium.png', 44661477, 0 FROM products WHERE yampi_id = 44661477;

-- CHAINLUBE OFF ROAD - 500 ML
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661478);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/chainlube-off-road-500-ml-69d6a03022a18-medium.png', 44661478, 0 FROM products WHERE yampi_id = 44661478;

-- CHAINLUBE OFF ROAD - 56 ML
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661479);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/chainlube-off-road-56-ml-69d6a0911824f-medium.jpg', 44661479, 0 FROM products WHERE yampi_id = 44661479;

-- KIT CHAINLUB 500ml + 56ml
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661480);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/kit-chainlub-500ml-56ml-69d9489e0229a-medium.png', 44661480, 0 FROM products WHERE yampi_id = 44661480;

-- POWER SYNT 4T 10W50
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661481);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/power-synt-4t-10w50-69d6a0e0625ae-medium.png', 44661481, 0 FROM products WHERE yampi_id = 44661481;

-- GEAR OIL PENTA LS SAE 75W90
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661482);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/gear-oil-penta-ls-sae-75w90-69d6a116e83db-medium.png', 44661482, 0 FROM products WHERE yampi_id = 44661482;

-- GEAR OIL PENTA LS SAE 75w140
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661483);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/gear-oil-penta-ls-sae-75w140-69d6a13dcec60-medium.png', 44661483, 0 FROM products WHERE yampi_id = 44661483;

-- CHAINLUBE STRONG ROAD - 500ml
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661484);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/chainlube-strong-road-500ml-69d6a1798a683-medium.png', 44661484, 0 FROM products WHERE yampi_id = 44661484;

-- RACING PRO 4T 15w50
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661485);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-pro-4t-15w50-69d6a1b158c2d-medium.png', 44661485, 0 FROM products WHERE yampi_id = 44661485;

-- BRAKE CLEAN - 25 L
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661486);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/brake-clean-25-l-69d948eab2882-medium.png', 44661486, 0 FROM products WHERE yampi_id = 44661486;

-- REX CLEANER - 5 L
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661487);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/rex-cleaner-5-l-69d9491570176-medium.png', 44661487, 0 FROM products WHERE yampi_id = 44661487;

-- REX CLEANER - 25 L
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661488);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/rex-cleaner-25-l-69d9499fafcd8-medium.png', 44661488, 0 FROM products WHERE yampi_id = 44661488;

-- RACING FORK OIL 2,5 W - 60 LITROS
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661489);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-25-w-60-litros-69d949cd0264e-medium.png', 44661489, 0 FROM products WHERE yampi_id = 44661489;

-- RACING FORK OIL 5W - 60 LITROS
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661490);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/racing-fork-oil-5w-60-litros-69d949fa4c5c6-medium.png', 44661490, 0 FROM products WHERE yampi_id = 44661490;

-- FETT 2000 - 100G
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661491);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/fett-2000-100g-69d6a1d9c86bd-medium.png', 44661491, 0 FROM products WHERE yampi_id = 44661491;

-- COPPER PASTE - 100G
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661492);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/copper-paste-100g-69d6a23d9eee3-medium.png', 44661492, 0 FROM products WHERE yampi_id = 44661492;

-- ATF DEXRON 3
DELETE FROM product_images WHERE product_id = (SELECT id FROM products WHERE yampi_id = 44661493);
INSERT INTO product_images (product_id, external_url, yampi_id, sort_order)
  SELECT id, 'https://images.yampi.me/assets/stores/rt-brasil/uploads/images/atf-dexron-3-69d94a23a1323-medium.png', 44661493, 0 FROM products WHERE yampi_id = 44661493;
