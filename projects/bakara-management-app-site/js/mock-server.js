// ============================================================================
// Portfolio preview mock backend — Bakara Management
// ----------------------------------------------------------------------------
// This file overrides window.fetch BEFORE app.js loads, so every /api/* call
// app.js makes is answered from an in-browser, in-memory demo dataset instead
// of hitting a real server. app.js itself is the real, unmodified production
// file — this shim is the ONLY thing that makes it a self-contained preview.
//
// Nothing here ever talks to the live Baraka Management domain, server, or
// database. All data is fictional, resets on every page reload, and never
// leaves the visitor's own browser.
// ============================================================================
(function () {
  'use strict';

  function uid() {
    return 'demo-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
  function todayISO(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  }

  // ---------------- farm-type categories (mirrors the real app's src/categories.js) ----------------
  var FARM_TYPES = {
    cow: { label: 'গরুর খামার', icon: '🐄',
      expense: ['গরু কেনার খরচ', 'খাবারের খরচ', 'ওষুধ / চিকিৎসা', 'শ্রমিকের খরচ', 'পরিবহন খরচ', 'বিদ্যুৎ / পানি', 'অন্যান্য খরচ'],
      income: ['গরু বিক্রির আয়', 'দুধ বিক্রির আয়', 'অন্যান্য আয়'] },
    poultry: { label: 'মুরগির খামার', icon: '🐔',
      expense: ['বাচ্চা কেনার খরচ', 'খাবারের খরচ', 'ওষুধ / ভ্যাকসিন', 'শ্রমিকের খরচ', 'বিদ্যুৎ / পানি', 'অন্যান্য খরচ'],
      income: ['মুরগি বিক্রির আয়', 'ডিম বিক্রির আয়', 'অন্যান্য আয়'] },
    goat: { label: 'ছাগলের খামার', icon: '🐐',
      expense: ['ছাগল কেনার খরচ', 'খাবারের খরচ', 'ওষুধ / চিকিৎসা', 'শ্রমিকের খরচ', 'পরিবহন খরচ', 'অন্যান্য খরচ'],
      income: ['ছাগল বিক্রির আয়', 'দুধ বিক্রির আয়', 'অন্যান্য আয়'] },
    duck: { label: 'হাঁসের খামার', icon: '🦆',
      expense: ['বাচ্চা কেনার খরচ', 'খাবারের খরচ', 'ওষুধ / ভ্যাকসিন', 'শ্রমিকের খরচ', 'বিদ্যুৎ / পানি', 'অন্যান্য খরচ'],
      income: ['হাঁস বিক্রির আয়', 'ডিম বিক্রির আয়', 'অন্যান্য আয়'] },
    fish: { label: 'মাছের খামার', icon: '🐟',
      expense: ['পোনা কেনার খরচ', 'খাবারের খরচ', 'ওষুধ', 'শ্রমিকের খরচ', 'পুকুর ভাড়া / রক্ষণাবেক্ষণ', 'বিদ্যুৎ', 'অন্যান্য খরচ'],
      income: ['মাছ বিক্রির আয়', 'অন্যান্য আয়'] },
    crop: { label: 'কৃষি / ফসল', icon: '🌾',
      expense: ['বীজ', 'সার', 'কীটনাশক', 'শ্রমিকের খরচ', 'সেচ খরচ', 'পরিবহন খরচ', 'অন্যান্য খরচ'],
      income: ['ফসল বিক্রির আয়', 'অন্যান্য আয়'] },
    other: { label: 'অন্যান্য খামার', icon: '🏡',
      expense: ['কেনাকাটা', 'খাবারের খরচ', 'ওষুধ / চিকিৎসা', 'শ্রমিকের খরচ', 'পরিবহন খরচ', 'বিদ্যুৎ / পানি', 'অন্যান্য খরচ'],
      income: ['বিক্রয় আয়', 'অন্যান্য আয়'] },
    family: { label: 'পারিবারিক হিসাব', icon: '🏠',
      expense: ['বাজার খরচ', 'খাবার', 'বিদ্যুৎ বিল', 'গ্যাস বিল', 'পানি বিল', 'বাসা ভাড়া', 'চিকিৎসা', 'যাতায়াত', 'শিক্ষা', 'পরিবারের অন্যান্য খরচ'],
      income: ['বেতন / আয়', 'অন্যান্য আয়'] },
  };
  function categoriesFor(type) { return FARM_TYPES[type] || FARM_TYPES.other; }

  // ---------------- seed data — fictional, for portfolio preview only ----------------
  var DEMO_USER = {
    id: 'demo-user', name: 'Tanvir Creates!', email: 'preview@tanvircreates.com',
    hasPassword: true, avatarColor: null,
  };

  var FARM_SEED = [
    { id: 'farm-dairy', name: 'Baraka Dairy Farm', type: 'cow', icon: '🐄', budget: 150000 },
    { id: 'farm-poultry', name: 'Baraka Poultry Farm', type: 'poultry', icon: '🐔', budget: 90000 },
    { id: 'farm-family', name: 'Family Management', type: 'family', icon: '🏠', budget: 65000 },
    { id: 'farm-goat', name: 'Hillside Goat Farm', type: 'goat', icon: '🐐', budget: 60000 },
    { id: 'farm-duck', name: 'Riverside Duck Farm', type: 'duck', icon: '🦆', budget: 45000 },
    { id: 'farm-fish', name: 'Blue Lake Fish Farm', type: 'fish', icon: '🐟', budget: 120000 },
  ];

  var ENTRY_SEED = [
    { farmId: 'farm-dairy', type: 'income', category: 'দুধ বিক্রির আয়', amount: 42000, daysAgo: 2, note: 'Monthly milk sales' },
    { farmId: 'farm-dairy', type: 'income', category: 'দুধ বিক্রির আয়', amount: 38500, daysAgo: 9, note: 'Milk sales - week 3' },
    { farmId: 'farm-dairy', type: 'expense', category: 'খাবারের খরচ', amount: 21000, daysAgo: 4, note: 'Cattle feed purchase' },
    { farmId: 'farm-dairy', type: 'expense', category: 'ওষুধ / চিকিৎসা', amount: 6500, daysAgo: 6, note: 'Veterinary checkup' },
    { farmId: 'farm-dairy', type: 'expense', category: 'শ্রমিকের খরচ', amount: 12000, daysAgo: 10, note: 'Farmhand wages' },
    { farmId: 'farm-dairy', type: 'income', category: 'দুধ বিক্রির আয়', amount: 40200, daysAgo: 35, note: 'Milk sales' },
    { farmId: 'farm-dairy', type: 'expense', category: 'খাবারের খরচ', amount: 19800, daysAgo: 37, note: 'Cattle feed purchase' },
    { farmId: 'farm-dairy', type: 'income', category: 'দুধ বিক্রির আয়', amount: 36000, daysAgo: 64, note: 'Milk sales' },
    { farmId: 'farm-dairy', type: 'expense', category: 'খাবারের খরচ', amount: 20500, daysAgo: 66, note: 'Cattle feed purchase' },
    { farmId: 'farm-dairy', type: 'expense', category: 'পরিবহন খরচ', amount: 3200, daysAgo: 70, note: 'Milk delivery transport' },

    { farmId: 'farm-poultry', type: 'income', category: 'ডিম বিক্রির আয়', amount: 31500, daysAgo: 3, note: 'Egg sales - wholesale' },
    { farmId: 'farm-poultry', type: 'expense', category: 'খাবারের খরচ', amount: 18200, daysAgo: 5, note: 'Poultry feed stock' },
    { farmId: 'farm-poultry', type: 'expense', category: 'বিদ্যুৎ / পানি', amount: 4200, daysAgo: 8, note: 'Coop electricity bill' },
    { farmId: 'farm-poultry', type: 'income', category: 'ডিম বিক্রির আয়', amount: 28700, daysAgo: 36, note: 'Egg sales - wholesale' },
    { farmId: 'farm-poultry', type: 'expense', category: 'খাবারের খরচ', amount: 16500, daysAgo: 39, note: 'Poultry feed stock' },
    { farmId: 'farm-poultry', type: 'income', category: 'মুরগি বিক্রির আয়', amount: 12000, daysAgo: 63, note: 'Sold 20 broilers' },
    { farmId: 'farm-poultry', type: 'expense', category: 'ওষুধ / ভ্যাকসিন', amount: 2800, daysAgo: 67, note: 'Vaccination batch' },

    { farmId: 'farm-family', type: 'income', category: 'বেতন / আয়', amount: 55000, daysAgo: 0, note: "Tanvir's monthly salary" },
    { farmId: 'farm-family', type: 'income', category: 'অন্যান্য আয়', amount: 9000, daysAgo: 6, note: "Sadia's tuition income" },
    { farmId: 'farm-family', type: 'expense', category: 'বাজার খরচ', amount: 9500, daysAgo: 2, note: 'Weekly grocery shopping' },
    { farmId: 'farm-family', type: 'expense', category: 'বাসা ভাড়া', amount: 15000, daysAgo: 3, note: 'Monthly house rent' },
    { farmId: 'farm-family', type: 'expense', category: 'শিক্ষা', amount: 6000, daysAgo: 5, note: "Children's school tuition fee" },
    { farmId: 'farm-family', type: 'expense', category: 'বিদ্যুৎ বিল', amount: 3200, daysAgo: 7, note: 'Electricity bill' },
    { farmId: 'farm-family', type: 'expense', category: 'গ্যাস বিল', amount: 1100, daysAgo: 7, note: 'Gas bill' },
    { farmId: 'farm-family', type: 'expense', category: 'পানি বিল', amount: 700, daysAgo: 7, note: 'Water bill' },
    { farmId: 'farm-family', type: 'expense', category: 'চিকিৎসা', amount: 2400, daysAgo: 9, note: "Mother's doctor visit & medicine" },
    { farmId: 'farm-family', type: 'expense', category: 'যাতায়াত', amount: 1800, daysAgo: 11, note: 'Family transport & fuel' },
    { farmId: 'farm-family', type: 'expense', category: 'পরিবারের অন্যান্য খরচ', amount: 2600, daysAgo: 14, note: "Eid clothes for the kids" },
    { farmId: 'farm-family', type: 'income', category: 'বেতন / আয়', amount: 54000, daysAgo: 32, note: "Tanvir's monthly salary" },
    { farmId: 'farm-family', type: 'expense', category: 'বাসা ভাড়া', amount: 15000, daysAgo: 34, note: 'Monthly house rent' },
    { farmId: 'farm-family', type: 'expense', category: 'বাজার খরচ', amount: 11200, daysAgo: 38, note: 'Grocery shopping' },
    { farmId: 'farm-family', type: 'expense', category: 'শিক্ষা', amount: 6000, daysAgo: 40, note: "Children's school tuition fee" },

    { farmId: 'farm-goat', type: 'income', category: 'ছাগল বিক্রির আয়', amount: 24000, daysAgo: 4, note: 'Sold 4 goats' },
    { farmId: 'farm-goat', type: 'income', category: 'দুধ বিক্রির আয়', amount: 6200, daysAgo: 9, note: 'Milk sales' },
    { farmId: 'farm-goat', type: 'expense', category: 'খাবারের খরচ', amount: 9500, daysAgo: 3, note: 'Feed & fodder' },
    { farmId: 'farm-goat', type: 'expense', category: 'ওষুধ / চিকিৎসা', amount: 2100, daysAgo: 11, note: 'Deworming & checkup' },
    { farmId: 'farm-goat', type: 'expense', category: 'শ্রমিকের খরচ', amount: 5000, daysAgo: 15, note: 'Caretaker wages' },
    { farmId: 'farm-goat', type: 'income', category: 'ছাগল বিক্রির আয়', amount: 18000, daysAgo: 38, note: 'Sold 3 goats' },
    { farmId: 'farm-goat', type: 'expense', category: 'খাবারের খরচ', amount: 8700, daysAgo: 41, note: 'Feed & fodder' },
    { farmId: 'farm-goat', type: 'income', category: 'দুধ বিক্রির আয়', amount: 5400, daysAgo: 68, note: 'Milk sales' },
    { farmId: 'farm-goat', type: 'expense', category: 'ওষুধ / চিকিৎসা', amount: 1800, daysAgo: 72, note: 'Deworming & checkup' },

    { farmId: 'farm-duck', type: 'income', category: 'ডিম বিক্রির আয়', amount: 17800, daysAgo: 2, note: 'Egg sales — local market' },
    { farmId: 'farm-duck', type: 'income', category: 'হাঁস বিক্রির আয়', amount: 9200, daysAgo: 12, note: 'Sold 12 ducks' },
    { farmId: 'farm-duck', type: 'expense', category: 'খাবারের খরচ', amount: 8100, daysAgo: 5, note: 'Duck feed stock' },
    { farmId: 'farm-duck', type: 'expense', category: 'বিদ্যুৎ / পানি', amount: 1600, daysAgo: 8, note: 'Pond water pump electricity' },
    { farmId: 'farm-duck', type: 'expense', category: 'ওষুধ / ভ্যাকসিন', amount: 900, daysAgo: 14, note: 'Vaccination batch' },
    { farmId: 'farm-duck', type: 'income', category: 'ডিম বিক্রির আয়', amount: 15200, daysAgo: 34, note: 'Egg sales — local market' },
    { farmId: 'farm-duck', type: 'expense', category: 'খাবারের খরচ', amount: 7400, daysAgo: 37, note: 'Duck feed stock' },
    { farmId: 'farm-duck', type: 'income', category: 'হাঁস বিক্রির আয়', amount: 7600, daysAgo: 62, note: 'Sold 9 ducks' },
    { farmId: 'farm-duck', type: 'expense', category: 'শ্রমিকের খরচ', amount: 2200, daysAgo: 65, note: 'Caretaker wages' },

    { farmId: 'farm-fish', type: 'income', category: 'মাছ বিক্রির আয়', amount: 68000, daysAgo: 6, note: 'Harvest sale — rui & katla' },
    { farmId: 'farm-fish', type: 'expense', category: 'পোনা কেনার খরচ', amount: 15000, daysAgo: 30, note: 'New fingerlings stock' },
    { farmId: 'farm-fish', type: 'expense', category: 'খাবারের খরচ', amount: 22000, daysAgo: 7, note: 'Fish feed — 3 months' },
    { farmId: 'farm-fish', type: 'expense', category: 'পুকুর ভাড়া / রক্ষণাবেক্ষণ', amount: 8000, daysAgo: 20, note: 'Pond maintenance' },
    { farmId: 'farm-fish', type: 'expense', category: 'শ্রমিকের খরচ', amount: 6000, daysAgo: 6, note: 'Labor for harvest' },
    { farmId: 'farm-fish', type: 'income', category: 'মাছ বিক্রির আয়', amount: 51000, daysAgo: 42, note: 'Harvest sale — pangas & tilapia' },
    { farmId: 'farm-fish', type: 'expense', category: 'খাবারের খরচ', amount: 19000, daysAgo: 45, note: 'Fish feed stock' },
    { farmId: 'farm-fish', type: 'income', category: 'মাছ বিক্রির আয়', amount: 47000, daysAgo: 74, note: 'Harvest sale — rui & katla' },
    { farmId: 'farm-fish', type: 'expense', category: 'শ্রমিকের খরচ', amount: 5200, daysAgo: 76, note: 'Labor for harvest' },
  ];

  // ---------------- mutable in-memory state (per browser tab; resets on reload) ----------------
  var state = {
    loggedIn: true, // preview opens straight into the dashboard — see the portfolio brief
    farms: FARM_SEED.map(function (f) { return Object.assign({}, f, { categoryBudgets: {}, createdAt: Date.now() }); }),
    entries: ENTRY_SEED.map(function (e, i) {
      return {
        id: uid(), farmId: e.farmId, type: e.type, category: e.category, amount: e.amount,
        date: todayISO(e.daysAgo), note: e.note,
        createdAt: Date.now() - (ENTRY_SEED.length - i) * 1000,
        updatedAt: Date.now() - (ENTRY_SEED.length - i) * 1000,
      };
    }),
  };

  function totalsFor(farmId) {
    var income = 0, expense = 0, count = 0;
    state.entries.forEach(function (e) {
      if (e.farmId !== farmId) return;
      count++;
      if (e.type === 'income') income += Number(e.amount) || 0;
      else expense += Number(e.amount) || 0;
    });
    return { income: income, expense: expense, net: income - expense, count: count };
  }
  function farmView(f) {
    var t = totalsFor(f.id);
    return { id: f.id, name: f.name, type: f.type, icon: f.icon, budget: f.budget, categoryBudgets: f.categoryBudgets || {}, createdAt: f.createdAt, totals: t };
  }
  function findFarm(id) { return state.farms.find(function (f) { return f.id === id; }) || null; }
  function findEntry(id) { return state.entries.find(function (e) { return e.id === id; }) || null; }

  function jsonResponse(body, status) {
    return Promise.resolve(new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  var REAL_FETCH = window.fetch.bind(window);

  window.fetch = function (input, init) {
    var rawUrl = typeof input === 'string' ? input : (input && input.url) || '';
    var method = ((init && init.method) || 'GET').toUpperCase();
    var path = rawUrl.replace(location.origin, '').split('?')[0];

    if (path.indexOf('/api/') !== 0) return REAL_FETCH(input, init); // fonts, images, etc. — pass through normally

    var body = null;
    try { body = init && init.body ? JSON.parse(init.body) : null; } catch (e) { /* ignore */ }

    // ---------------- auth ----------------
    if (path === '/api/auth/me' && method === 'GET') {
      return jsonResponse({ user: state.loggedIn ? DEMO_USER : null, googleEnabled: false });
    }
    if (path === '/api/auth/logout' && method === 'POST') {
      state.loggedIn = false;
      return jsonResponse({ ok: true });
    }
    if ((path === '/api/auth/login' || path === '/api/auth/signup') && method === 'POST') {
      // any credentials "work" here — this is a design preview, not a real login
      state.loggedIn = true;
      return jsonResponse({ user: DEMO_USER });
    }
    if (path === '/api/auth/forgot-password' && method === 'POST') {
      return jsonResponse({ ok: true, message: 'এটি একটি পোর্টফোলিও প্রিভিউ — এখানে সত্যিকারের কোড পাঠানো হয় না। Login-এ ফিরে দেখুন।' });
    }
    if (path === '/api/auth/verify-reset-code' && method === 'POST') {
      return jsonResponse({ error: 'পাসওয়ার্ড রিসেট এই প্রিভিউ ভার্সনে সক্রিয় নয়।' }, 400);
    }
    if (path === '/api/auth/reset-password' && method === 'POST') {
      return jsonResponse({ error: 'পাসওয়ার্ড রিসেট এই প্রিভিউ ভার্সনে সক্রিয় নয়।' }, 400);
    }
    if (path === '/api/auth/me' && method === 'PATCH') {
      if (body && body.name) DEMO_USER.name = body.name;
      if (body && 'avatarColor' in body) DEMO_USER.avatarColor = body.avatarColor;
      return jsonResponse({ user: DEMO_USER });
    }

    // ---------------- farms ----------------
    if (path === '/api/farms/types' && method === 'GET') {
      var types = Object.keys(FARM_TYPES).filter(function (k) { return k !== 'family'; })
        .map(function (k) { return { key: k, label: FARM_TYPES[k].label, icon: FARM_TYPES[k].icon }; });
      return jsonResponse({ types: types });
    }
    if (path === '/api/farms/activity/recent' && method === 'GET') {
      var farmById = {};
      state.farms.forEach(function (f) { farmById[f.id] = f; });
      var all = state.entries.slice().sort(function (a, b) { return b.date.localeCompare(a.date) || b.createdAt - a.createdAt; });
      var recent = all.slice(0, 6).map(function (e) {
        var f = farmById[e.farmId];
        return Object.assign({}, e, { farmName: f ? f.name : '', farmIcon: f ? f.icon : '🏡', farmType: f ? f.type : 'other' });
      });
      return jsonResponse({ recent: recent });
    }
    if (path === '/api/farms/report/entries' && method === 'GET') {
      var farmById2 = {};
      state.farms.forEach(function (f) { farmById2[f.id] = f; });
      var allE = state.entries.slice().sort(function (a, b) { return b.date.localeCompare(a.date) || b.createdAt - a.createdAt; });
      var withFarm = allE.map(function (e) {
        var f = farmById2[e.farmId];
        return Object.assign({}, e, { farmName: f ? f.name : '', farmIcon: f ? f.icon : '🏡', farmType: f ? f.type : 'other' });
      });
      return jsonResponse({ entries: withFarm });
    }
    if (path === '/api/farms' && method === 'GET') {
      return jsonResponse({ farms: state.farms.map(farmView) });
    }
    if (path === '/api/farms' && method === 'POST') {
      var type = FARM_TYPES[body && body.type] ? body.type : 'other';
      var farm = { id: uid(), name: (body && body.name) || 'নতুন খামার', type: type, icon: FARM_TYPES[type].icon, budget: (body && body.budget) || 0, categoryBudgets: {}, createdAt: Date.now() };
      state.farms.push(farm);
      return jsonResponse({ farm: farmView(farm) }, 201);
    }
    var mFarmEntries = path.match(/^\/api\/farms\/([^/]+)\/entries$/);
    if (mFarmEntries && method === 'POST') {
      var f1 = findFarm(mFarmEntries[1]);
      if (!f1) return jsonResponse({ error: 'খামার খুঁজে পাওয়া যায়নি।' }, 404);
      var entry = {
        id: uid(), farmId: f1.id, type: body.type, category: body.category,
        amount: Number(body.amount) || 0, date: body.date, note: body.note || '',
        createdAt: Date.now(), updatedAt: Date.now(),
      };
      state.entries.push(entry);
      return jsonResponse({ entry: entry, farm: farmView(f1) }, 201);
    }
    var mFarmId = path.match(/^\/api\/farms\/([^/]+)$/);
    if (mFarmId && method === 'GET') {
      var f2 = findFarm(mFarmId[1]);
      if (!f2) return jsonResponse({ error: 'খামার খুঁজে পাওয়া যায়নি।' }, 404);
      var farmEntries = state.entries.filter(function (e) { return e.farmId === f2.id; });
      return jsonResponse({ farm: farmView(f2), entries: farmEntries, categories: categoriesFor(f2.type) });
    }
    if (mFarmId && method === 'PATCH') {
      var f3 = findFarm(mFarmId[1]);
      if (!f3) return jsonResponse({ error: 'খামার খুঁজে পাওয়া যায়নি।' }, 404);
      Object.assign(f3, body || {});
      return jsonResponse({ farm: farmView(f3) });
    }
    if (mFarmId && method === 'DELETE') {
      var f4 = findFarm(mFarmId[1]);
      if (!f4) return jsonResponse({ error: 'খামার খুঁজে পাওয়া যায়নি।' }, 404);
      state.farms = state.farms.filter(function (f) { return f.id !== f4.id; });
      state.entries = state.entries.filter(function (e) { return e.farmId !== f4.id; });
      return jsonResponse({ ok: true });
    }

    // ---------------- entries ----------------
    var mEntryId = path.match(/^\/api\/entries\/([^/]+)$/);
    if (mEntryId && method === 'PATCH') {
      var e1 = findEntry(mEntryId[1]);
      if (!e1) return jsonResponse({ error: 'হিসাব খুঁজে পাওয়া যায়নি।' }, 404);
      Object.assign(e1, body || {}, { updatedAt: Date.now() });
      return jsonResponse({ entry: e1 });
    }
    if (mEntryId && method === 'DELETE') {
      var e2 = findEntry(mEntryId[1]);
      if (!e2) return jsonResponse({ error: 'হিসাব খুঁজে পাওয়া যায়নি।' }, 404);
      state.entries = state.entries.filter(function (e) { return e.id !== e2.id; });
      return jsonResponse({ ok: true });
    }

    // ---------------- reports ----------------
    if (path === '/api/reports/send-monthly' && method === 'POST') {
      return jsonResponse({ error: 'মাসিক রিপোর্ট ইমেইল এই প্রিভিউ ভার্সনে সক্রিয় নয়।' }, 400);
    }

    // ---------------- Google login: intentionally left unhandled ----------------
    // googleEnabled is always false above, so app.js shows the button disabled and
    // never calls this — matches real behavior when Google isn't configured.

    return jsonResponse({ error: 'Not available in this preview.' }, 404);
  };
})();
