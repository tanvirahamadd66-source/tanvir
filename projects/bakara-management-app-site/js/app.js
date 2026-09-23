(function () {
  'use strict';

  var state = {
    user: null,
    googleEnabled: false,
    authMode: 'login', // 'login' | 'signup' | 'forgot' | 'verify-code' | 'reset'
    authError: '',
    authNotice: '',
    authBusy: false,
    resetToken: null,
    resetEmail: '',
    view: 'dashboard', // dashboard | reports | settings | farm
    newFarmModalOpen: false,
    farms: [],
    farmTypes: [],
    recentActivity: [],
    currentFarm: null, // {farm, entries, categories}
    newFarm: { type: null, name: '', budget: '' },
    showEntryForm: false,
    entryType: 'income',
    editingEntryId: null,
    editFarmOpen: false,
    reportEntries: [],
    reportFilter: 'this-month', // this-month | last-month | this-year | custom
    reportCustom: { from: '', to: '' },
    historyFilter: 'this-month', // this-month | last-month | this-year | all | custom
    historyCustom: { from: '', to: '' },
    reportMailBusy: false,
    reportMailStatus: '',
    quickAddType: null, // null | 'income' | 'expense'
    categoryBudgetModalOpen: false,
    activeQuickAction: null, // null | 'new-entry' | 'today-income' | 'today-expense' | 'budget' | 'list'
    authFields: { name: '', email: '', password: '', password2: '' },
    lang: 'bn', // 'bn' | 'en' — Settings থেকে পরিবর্তনযোগ্য, localStorage-এ সংরক্ষিত থাকে
    familyMonth: null, // 'YYYY-MM' — পরিবারের হিসাব কোন মাসের জন্য দেখানো হচ্ছে (family farm খুললে current month সেট হয়)
    editProfileOpen: false,
    profileFields: { name: '', avatarColor: '' },
    profileBusy: false,
  };

  var root = document.getElementById('root');

  // ---------------- ভাষা সিস্টেম (English + বাংলা) ----------------
  var I18N = {
    bn: {
      appName: 'বাকারা ম্যানেজমেন্ট', tagline: 'স্মার্ট ম্যানেজমেন্ট',
      dashboard: 'ড্যাশবোর্ড', reports: 'রিপোর্ট', settings: 'সেটিংস', history: 'হিস্টোরি', logout: 'লগআউট',
      downloadApp: 'অ্যাপ ডাউনলোড',
      downloadAppHeading: 'বাকারা ম্যানেজমেন্ট অ্যাপ ডাউনলোড করুন',
      downloadAppDesc: 'আপনার Android ফোনে সরাসরি অ্যাপ আকারে ইনস্টল করুন। যেকোনো ব্রাউজার থেকে নিচের বাটনে ক্লিক করলেই ডাউনলোড শুরু হবে।',
      downloadAppBtn: 'APK ডাউনলোড করুন',
      downloadAppSteps: 'ইনস্টল করার নিয়ম',
      downloadAppStep1: 'নিচের বাটনে ক্লিক করে APK ফাইলটি ডাউনলোড করুন',
      downloadAppStep2: 'ডাউনলোড হওয়া ফাইলে ট্যাপ করুন',
      downloadAppStep3: 'প্রথমবার "Install from unknown sources" অনুমতি চাইলে Allow করুন',
      downloadAppStep4: 'Install চাপুন — অ্যাপের আইকন হোম স্ক্রিনে চলে আসবে',
      downloadAppNote: 'অ্যাপটি আপনার লাইভ ডেটা সরাসরি লোড করে, তাই লগইন করলেই আপনার আসল হিসাব দেখতে পাবেন।',
      welcome: 'স্বাগতম', newAccount: 'নতুন অ্যাকাউন্ট', login: 'লগইন করুন', signup: 'সাইন আপ করুন',
      name: 'নাম', email: 'ইমেইল', password: 'পাসওয়ার্ড', passwordAgain: 'পাসওয়ার্ড আবার লিখুন',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?', or: 'অথবা', continueWithGoogle: 'Google দিয়ে চালিয়ে যান',
      continueWithGoogleSoon: 'Google দিয়ে চালিয়ে যান (শীঘ্রই)', newHere: 'নতুন এখানে?', createAccount: 'অ্যাকাউন্ট তৈরি করুন',
      alreadyHaveAccount: 'আগে থেকেই অ্যাকাউন্ট আছে?', backToLogin: '← লগইনে ফিরে যান',
      accountRecovery: 'অ্যাকাউন্ট পুনরুদ্ধার', sendResetLink: 'ভেরিফিকেশন কোড পাঠান',
      newPassword: 'নতুন পাসওয়ার্ড', resetPassword: 'পাসওয়ার্ড রিসেট করুন', savePassword: 'পাসওয়ার্ড সংরক্ষণ করুন',
      enterCodeHeading: 'ভেরিফিকেশন কোড দিন', enterCodeDesc: 'আমরা একটি ৬-সংখ্যার কোড পাঠিয়েছি:',
      verificationCode: 'ভেরিফিকেশন কোড', verifyCode: 'যাচাই করুন', resendCode: 'কোড আবার পাঠান',
      codeResent: 'নতুন কোড পাঠানো হয়েছে। আগের কোডটি আর কাজ করবে না।', codeVerified: 'কোড যাচাই সফল হয়েছে।',
      hello: 'হ্যালো', welcomeToApp: 'বারাকা স্মার্ট ম্যানেজমেন্টে স্বাগতম।',
      heroDesc: 'আপনার খামার ও পরিবারের প্রতিটি হিসাব সহজে পরিচালনা করুন—বাজেট থেকে শুরু করে দৈনন্দিন খরচ, আয় এবং লাভ-ক্ষতির হিসাব পর্যন্ত।',
      heroTagline: 'স্মার্ট ম্যানেজমেন্ট — এক জায়গায় আপনার খামার ও পরিবারের সম্পূর্ণ হিসাব।',
      farmManagement: 'খামার ব্যবস্থাপনা', totalIncome: 'মোট আয়', totalExpense: 'মোট খরচ', totalRecords: 'মোট হিসাব',
      totalBudget: 'মোট বাজেট', totalProfit: 'মোট লাভ', totalLoss: 'মোট ক্ষতি',
      myFarms: 'আমার খামারসমূহ', myFarmsDesc: 'আপনার সব খামার ও পরিবারের হিসাব এক জায়গায় পরিচালনা করুন।',
      recentActivity: 'সাম্প্রতিক কাজ', noFarmsYet: 'এখনও কোনো খামার যোগ করা হয়নি',
      noFarmsDesc: 'গরু, মুরগি, ছাগল, মাছ বা যেকোনো খামারের জন্য একটি বক্স তৈরি করুন — প্রতিটির আয়-ব্যয় আলাদাভাবে রাখতে পারবেন।',
      addFirstFarm: '+ প্রথম খামার যোগ করুন', startFamily: 'পারিবারিক হিসাব শুরু করুন',
      family: 'পরিবার', familyAccounting: 'পারিবারিক হিসাব', getStarted: 'শুরু করুন →', openFarm: 'খামার খুলুন →',
      addNewFarm: 'নতুন খামার যোগ করুন', whatFarmType: 'কী ধরনের খামার তৈরি করতে চান?',
      farmName: 'খামারের নাম', farmNamePlaceholder: 'যেমন: আমার গরুর খামার', startingBudget: 'শুরুর বিনিয়োগ / বাজেট (৳)',
      createFarm: 'খামার তৈরি করুন', cancel: 'বাতিল', edit: 'এডিট', delete: 'মুছুন',
      familyRecords: 'পরিবারের হিসাবসমূহ', farmRecords: 'খামারের হিসাবসমূহ', budgetExceeded: 'বাজেট অতিক্রম হয়েছে',
      myBudget: 'আমার বাজেট', spent: 'খরচ হয়েছে', remainingBudget: 'অবশিষ্ট বাজেট', profitLoss: 'লাভ / ক্ষতি',
      percentSpent: '% খরচ হয়েছে', overspend: 'অতিরিক্ত খরচ',
      quickActions: 'দ্রুত কাজ', newRecord: 'নতুন হিসাব', todaysIncome: 'আজকের আয়', todaysExpense: 'আজকের খরচ',
      budget: 'বাজেট', recordsList: 'হিসাবের তালিকা',
      addTodaysIncome: 'আজকের আয় যোগ করুন', addTodaysExpense: 'আজকের খরচ যোগ করুন', amount: 'টাকার পরিমাণ',
      date: 'তারিখ', description: 'বিবরণ / নোট', optional: 'ঐচ্ছিক', save: 'সংরক্ষণ করুন',
      category: 'ক্যাটাগরি', income: 'আয়', expense: 'খরচ', updateRecord: 'হিসাব আপডেট করুন', addRecord: 'যোগ করুন',
      monthlyIncomeVsExpense: 'মাসিক আয় বনাম খরচ', profitLossTrend: 'লাভ / ক্ষতির প্রবণতা',
      categoryBreakdown: 'খরচের হিসাব — কোন খাতে কত খরচ হয়েছে',
      editFarmInfo: 'খামারের তথ্য এডিট করুন', deleteFarmConfirm: 'ও এর সব হিসাব স্থায়ীভাবে মুছে ফেলতে চান?',
      deleteRecordConfirm: 'এই হিসাবটি মুছে ফেলতে চান?',
      tableDate: 'তারিখ', tableType: 'ধরন', tableCategory: 'ক্যাটাগরি', tableDesc: 'বিবরণ', tableAmount: 'পরিমাণ',
      tableFarmFamily: 'খামার / পরিবার', noRecordsYet: 'এখনও কোনো হিসাব যোগ করা হয়নি',
      thisMonth: 'এই মাস', lastMonth: 'গত মাস', thisYear: 'এই বছর', allTime: 'সব সময়', customRange: 'কাস্টম সময়',
      monthlyIncome: 'মাসিক আয়', monthlyExpense: 'মাসিক খরচ', monthlyProfitLoss: 'মাসিক লাভ / ক্ষতি',
      reportsHeading: 'রিপোর্ট', reportsDesc: 'সময় বেছে নিয়ে আয়, খরচ ও লাভ-ক্ষতির বিস্তারিত রিপোর্ট দেখুন।',
      categoryWiseExpense: 'ক্যাটাগরি অনুযায়ী খরচ', incomeVsExpensePeriod: 'আয় বনাম খরচ (নির্বাচিত সময়)',
      overallComparison: 'সামগ্রিক হিসাব — খামারভিত্তিক তুলনা', overallTotal: 'সামগ্রিক মোট', profit: 'লাভ', loss: 'ক্ষতি',
      noFarmsForReports: 'এখনও কোনো খামার নেই', noFarmsForReportsDesc: 'খামার যোগ করে হিসাব লিখলে এখানে সার্বিক রিপোর্ট দেখতে পাবেন।',
      historyHeading: 'হিস্টোরি', historyDesc: 'প্রতিদিনের হিসাব তারিখ অনুযায়ী দেখুন — কোন দিন কী আয়/খরচ হয়েছে।',
      noRecordsThisPeriod: 'এই সময়ে কোনো হিসাব পাওয়া যায়নি', tryDifferentPeriod: 'ভিন্ন সময়কাল বেছে নিন বা কোনো খামারে নতুন হিসাব যোগ করুন।',
      settingsHeading: 'সেটিংস', profile: 'প্রোফাইল', logoutButton: 'লগআউট করুন',
      language: 'ভাষা', languageDesc: 'অ্যাপের ভাষা পরিবর্তন করুন — পুরো অ্যাপ সেই ভাষাতেই দেখাবে।',
      monthlyReportEmail: 'মাসিক রিপোর্ট ইমেইল',
      monthlyReportDesc: 'প্রতি মাসের ১ তারিখে আগের মাসের সম্পূর্ণ হিসাব (আয়, খরচ, লাভ-ক্ষতি, বাজেট) স্বয়ংক্রিয়ভাবে আপনার ইমেইলে পাঠানো হবে। এখনই একটি টেস্ট রিপোর্ট পাঠিয়ে দেখে নিতে পারেন।',
      sendTestReport: '📧 টেস্ট রিপোর্ট এখনই পাঠান', sending: 'পাঠানো হচ্ছে…',
      loading: 'লোড হচ্ছে…', singleCategoryNote: 'এই সময়ে শুধু এই একটি খাতেই খরচ হয়েছে — তাই এটি 100%।',
      noCategoryData: 'খরচ যোগ করলে এখানে বিভাগ অনুযায়ী ভাঙন দেখা যাবে', noTrendData: 'হিসাব যোগ করলে এখানে লাভ/ক্ষতির প্রবণতা দেখা যাবে',
      noChartData: 'হিসাব যোগ করলে এখানে গ্রাফ দেখা যাবে', footerLine: 'বাকারা ম্যানেজমেন্ট — আপনার খামার ও পরিবারের বিশ্বস্ত সঙ্গী',
      categoryOfTotal: 'মোট খরচের', noExpenseYet: 'এখনও কোনো খরচ নেই', passwordMismatch: 'দুটি পাসওয়ার্ড মিলছে না।',
      categoryBreakdownDesc: 'কোন খাতে সবচেয়ে বেশি খরচ হচ্ছে তা এক নজরে দেখুন।',
      today: 'আজ', prevMonth: 'আগের মাস', nextMonth: 'পরের মাস',
      editProfile: 'প্রোফাইল এডিট করুন', avatarColor: 'অ্যাভাটারের রং', saveProfile: 'সংরক্ষণ করুন',
      profileUpdated: 'প্রোফাইল আপডেট হয়েছে।',
      monthlyHistory: 'মাসিক ইতিহাস', selectMonth: 'মাস নির্বাচন করুন', thisMonthLabel: 'এই মাস',
      viewingMonth: 'যে মাসের হিসাব দেখছেন', showPassword: 'পাসওয়ার্ড দেখুন', hidePassword: 'পাসওয়ার্ড লুকান',
    },
    en: {
      appName: 'Bakara Management', tagline: 'Smart Management',
      dashboard: 'Dashboard', reports: 'Reports', settings: 'Settings', history: 'History', logout: 'Log out',
      downloadApp: 'Download App',
      downloadAppHeading: 'Download the Bakara Management App',
      downloadAppDesc: 'Install the app directly on your Android phone. Click the button below from any browser to start the download.',
      downloadAppBtn: 'Download APK',
      downloadAppSteps: 'Installation steps',
      downloadAppStep1: 'Tap the button below to download the APK file',
      downloadAppStep2: 'Open the downloaded file',
      downloadAppStep3: 'Allow the "Install from unknown sources" permission if asked',
      downloadAppStep4: 'Tap Install — the app icon will appear on your home screen',
      downloadAppNote: 'The app loads your live data directly, so once you log in you\'ll see your real accounts.',
      welcome: 'Welcome', newAccount: 'New Account', login: 'Log In', signup: 'Sign Up',
      name: 'Name', email: 'Email', password: 'Password', passwordAgain: 'Confirm Password',
      forgotPassword: 'Forgot password?', or: 'or', continueWithGoogle: 'Continue with Google',
      continueWithGoogleSoon: 'Continue with Google (coming soon)', newHere: 'New here?', createAccount: 'Create account',
      alreadyHaveAccount: 'Already have an account?', backToLogin: '← Back to login',
      accountRecovery: 'Account Recovery', sendResetLink: 'Send verification code',
      newPassword: 'New Password', resetPassword: 'Reset Password', savePassword: 'Save Password',
      enterCodeHeading: 'Enter verification code', enterCodeDesc: 'We sent a 6-digit code to:',
      verificationCode: 'Verification code', verifyCode: 'Verify', resendCode: 'Resend code',
      codeResent: 'A new code has been sent. The previous code no longer works.', codeVerified: 'Code verified successfully.',
      hello: 'Hello', welcomeToApp: 'Welcome to Baraka Smart Management.',
      heroDesc: 'Manage every record of your farm and family with ease — from budgets to daily expenses, income, and profit-loss tracking.',
      heroTagline: 'Smart Management — all your farm and family accounts, in one place.',
      farmManagement: 'Farm Management', totalIncome: 'Total Income', totalExpense: 'Total Expense', totalRecords: 'Total Records',
      totalBudget: 'Total Budget', totalProfit: 'Total Profit', totalLoss: 'Total Loss',
      myFarms: 'My Farms', myFarmsDesc: 'Manage all your farm and family records in one place.',
      recentActivity: 'Recent Activity', noFarmsYet: 'No farms added yet',
      noFarmsDesc: 'Create a box for cattle, poultry, goats, fish, or any farm — keep each one’s income and expenses separate.',
      addFirstFarm: '+ Add First Farm', startFamily: 'Start Family Management',
      family: 'Family', familyAccounting: 'Family Management', getStarted: 'Get started →', openFarm: 'Open Farm →',
      addNewFarm: 'Add New Farm', whatFarmType: 'What type of farm would you like to create?',
      farmName: 'Farm Name', farmNamePlaceholder: 'e.g. My Cattle Farm', startingBudget: 'Starting Investment / Budget (৳)',
      createFarm: 'Create Farm', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
      familyRecords: 'Family Records', farmRecords: 'Farm Records', budgetExceeded: 'Budget exceeded',
      myBudget: 'My Budget', spent: 'Spent', remainingBudget: 'Remaining Budget', profitLoss: 'Profit / Loss',
      percentSpent: '% spent', overspend: 'Overspent',
      quickActions: 'Quick Actions', newRecord: 'New Record', todaysIncome: "Today's Income", todaysExpense: "Today's Expense",
      budget: 'Budget', recordsList: 'Records List',
      addTodaysIncome: "Add Today's Income", addTodaysExpense: "Add Today's Expense", amount: 'Amount',
      date: 'Date', description: 'Description / Note', optional: 'optional', save: 'Save',
      category: 'Category', income: 'Income', expense: 'Expense', updateRecord: 'Update Record', addRecord: 'Add',
      monthlyIncomeVsExpense: 'Monthly Income vs Expense', profitLossTrend: 'Profit / Loss Trend',
      categoryBreakdown: 'Expense Breakdown — Spending by Category',
      editFarmInfo: 'Edit Farm Info', deleteFarmConfirm: 'and all its records permanently?',
      deleteRecordConfirm: 'Delete this record?',
      tableDate: 'Date', tableType: 'Type', tableCategory: 'Category', tableDesc: 'Description', tableAmount: 'Amount',
      tableFarmFamily: 'Farm / Family', noRecordsYet: 'No records added yet',
      thisMonth: 'This Month', lastMonth: 'Last Month', thisYear: 'This Year', allTime: 'All Time', customRange: 'Custom Range',
      monthlyIncome: 'Monthly Income', monthlyExpense: 'Monthly Expense', monthlyProfitLoss: 'Monthly Profit / Loss',
      reportsHeading: 'Reports', reportsDesc: 'Choose a time period to view a detailed income, expense, and profit-loss report.',
      categoryWiseExpense: 'Expense by Category', incomeVsExpensePeriod: 'Income vs Expense (selected period)',
      overallComparison: 'Overall Comparison — by Farm', overallTotal: 'Overall Total', profit: 'profit', loss: 'loss',
      noFarmsForReports: 'No farms yet', noFarmsForReportsDesc: 'Add a farm and record entries to see an overall report here.',
      historyHeading: 'History', historyDesc: 'View daily records by date — what income/expense happened on which day.',
      noRecordsThisPeriod: 'No records found for this period', tryDifferentPeriod: 'Choose a different period or add a new record to a farm.',
      settingsHeading: 'Settings', profile: 'Profile', logoutButton: 'Log Out',
      language: 'Language', languageDesc: 'Change the app language — the whole app will switch to that language.',
      monthlyReportEmail: 'Monthly Report Email',
      monthlyReportDesc: 'On the 1st of every month, a complete report of the previous month (income, expense, profit-loss, budget) is automatically emailed to you. You can send a test report right now.',
      sendTestReport: '📧 Send Test Report Now', sending: 'Sending…',
      loading: 'Loading…', singleCategoryNote: 'Only this one category had expenses this period — so it shows 100%.',
      noCategoryData: 'Add an expense to see the category breakdown here', noTrendData: 'Add records to see the profit/loss trend here',
      noChartData: 'Add records to see the chart here', footerLine: 'Bakara Management — your trusted companion for farm and family',
      categoryOfTotal: 'of total expense', noExpenseYet: 'No expenses yet', passwordMismatch: 'The two passwords do not match.',
      categoryBreakdownDesc: 'See at a glance which category is costing you the most.',
      today: 'Today', prevMonth: 'Previous month', nextMonth: 'Next month',
      editProfile: 'Edit Profile', avatarColor: 'Avatar color', saveProfile: 'Save',
      profileUpdated: 'Profile updated.',
      monthlyHistory: 'Monthly History', selectMonth: 'Select month', thisMonthLabel: 'This month',
      viewingMonth: 'Viewing month', showPassword: 'Show password', hidePassword: 'Hide password',
    },
  };
  function loadLang() {
    // পোর্টফোলিও প্রিভিউ-only default: visitor প্রথমবার খুললেই যেন English দেখে (আসল লাইভ অ্যাপের
    // ডিফল্ট বাংলা-ই থাকে, অপরিবর্তিত — এটা শুধু এই preview কপিতে)। Language switcher থেকে বাংলা
    // বেছে নিলে localStorage-এ সেভ থাকে ও পরের বারও মনে রাখে, ঠিক আসল অ্যাপের মতোই।
    try { return localStorage.getItem('baraka_lang') || 'en'; } catch (e) { return 'en'; }
  }
  function saveLang(lang) {
    try { localStorage.setItem('baraka_lang', lang); } catch (e) {}
  }
  function t(key) {
    var dict = I18N[state.lang] || I18N.bn;
    return (dict && dict[key] != null) ? dict[key] : (I18N.bn[key] || key);
  }
  // পরিচিত ক্যাটাগরি নামের ইংরেজি অনুবাদ — শুধু দেখানোর জন্য; ডাটাবেজে সবসময় বাংলাতেই সংরক্ষিত থাকে,
  // তাই ভাষা পাল্টালে পুরনো কোনো ডাটা নষ্ট/পরিবর্তন হয় না
  var CATEGORY_EN = {
    'গরু কেনার খরচ': 'Cow purchase', 'খাবারের খরচ': 'Feed cost', 'ওষুধ / চিকিৎসা': 'Medicine / Treatment',
    'শ্রমিকের খরচ': 'Labor cost', 'পরিবহন খরচ': 'Transport cost', 'বিদ্যুৎ / পানি': 'Electricity / Water', 'অন্যান্য খরচ': 'Other expense',
    'গরু বিক্রির আয়': 'Cattle sale income', 'দুধ বিক্রির আয়': 'Milk sale income', 'অন্যান্য আয়': 'Other income',
    'বাচ্চা কেনার খরচ': 'Chick purchase', 'ওষুধ / ভ্যাকসিন': 'Medicine / Vaccine', 'মুরগি বিক্রির আয়': 'Poultry sale income',
    'ডিম বিক্রির আয়': 'Egg sale income', 'ছাগল কেনার খরচ': 'Goat purchase', 'ছাগল বিক্রির আয়': 'Goat sale income',
    'হাঁস বিক্রির আয়': 'Duck sale income', 'পোনা কেনার খরচ': 'Fingerling purchase', 'পুকুর ভাড়া / রক্ষণাবেক্ষণ': 'Pond rent / maintenance',
    'বিদ্যুৎ': 'Electricity', 'মাছ বিক্রির আয়': 'Fish sale income', 'বীজ': 'Seeds', 'সার': 'Fertilizer', 'কীটনাশক': 'Pesticide',
    'সেচ খরচ': 'Irrigation cost', 'ফসল বিক্রির আয়': 'Crop sale income', 'কেনাকাটা': 'Purchases', 'বিক্রয় আয়': 'Sales income',
    'বাজার খরচ': 'Market / Grocery', 'খাবার': 'Food', 'বিদ্যুৎ বিল': 'Electricity bill', 'গ্যাস বিল': 'Gas bill',
    'পানি বিল': 'Water bill', 'বাসা ভাড়া': 'House rent', 'চিকিৎসা': 'Medical', 'যাতায়াত': 'Transport', 'শিক্ষা': 'Education',
    'পরিবারের অন্যান্য খরচ': 'Other household expense', 'বেতন / আয়': 'Salary / Income',
  };
  function catLabel(catBn) {
    if (state.lang !== 'en') return catBn;
    return CATEGORY_EN[catBn] || catBn;
  }
  var FARM_TYPE_EN = {
    'গরুর খামার': 'Cattle Farm', 'মুরগির খামার': 'Poultry Farm', 'ছাগলের খামার': 'Goat Farm', 'হাঁসের খামার': 'Duck Farm',
    'মাছের খামার': 'Fish Farm', 'কৃষি / ফসল': 'Agriculture / Crops', 'অন্যান্য খামার': 'Other Farm', 'পারিবারিক হিসাব': 'Family Management',
  };
  var EYE_OPEN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.86 21.86 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 7 11 7a21.86 21.86 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  // পাসওয়ার্ড ফিল্ড — পাশে eye আইকন সহ, চাপলে টেক্সট দেখা/লুকানো যায়
  function passwordFieldHtml(id, value, autocomplete) {
    return '<div class="pw-field"><input id="' + id + '" type="password" autocomplete="' + autocomplete + '" value="' + esc(value) + '" required>' +
      '<button type="button" class="pw-toggle" data-for="' + id + '" aria-label="' + esc(t('showPassword')) + '" title="' + esc(t('showPassword')) + '">' + EYE_OPEN_SVG + '</button></div>';
  }

  // Logout আইকন — Unicode "⏻" কিছু Android ফন্টে ফাঁকা বক্স (tofu) হিসেবে দেখাচ্ছিল,
  // তাই inline SVG ব্যবহার করা হলো যাতে সব ডিভাইস/ফন্টে নিশ্চিতভাবে দেখা যায়
  var LOGOUT_ICON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

  function typeLabel(bnLabel) {
    if (state.lang !== 'en') return bnLabel;
    return FARM_TYPE_EN[bnLabel] || bnLabel;
  }
  // সার্ভার থেকে আসা error message (এখনো বাংলায় লেখা) — English মোডে দেখানোর জন্য অনুবাদ
  var ERROR_EN = {
    'নাম দিন।': 'Please enter a name.',
    'সঠিক ইমেইল দিন।': 'Please enter a valid email.',
    'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।': 'Password must be at least 8 characters.',
    'এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে।': 'An account with this email already exists.',
    'সার্ভার সমস্যা, আবার চেষ্টা করুন।': 'Server error, please try again.',
    'ইমেইল অথবা পাসওয়ার্ড ভুল।': 'Incorrect email or password.',
    'লিংকের মেয়াদ শেষ হয়ে গেছে অথবা এটি সঠিক নয়। আবার চেষ্টা করুন।': 'This link has expired or is invalid. Please try again.',
    'হিসাব খুঁজে পাওয়া যায়নি।': 'Record not found.',
    'হিসাবের ধরন সঠিক নয়।': 'Invalid record type.',
    'সঠিক টাকার পরিমাণ দিন।': 'Please enter a valid amount.',
    'সঠিক তারিখ দিন।': 'Please enter a valid date.',
    'খামারের নাম দিন।': 'Please enter a farm name.',
    'খামার খুঁজে পাওয়া যায়নি।': 'Farm not found.',
    'হিসাবের ধরন (আয়/খরচ) নির্বাচন করুন।': 'Please select the record type (income/expense).',
    'ক্যাটাগরি নির্বাচন করুন।': 'Please select a category.',
    'ব্যবহারকারী খুঁজে পাওয়া যায়নি।': 'User not found.',
    'রিপোর্ট পাঠাতে সমস্যা হয়েছে।': 'There was a problem sending the report.',
    'একটি সমস্যা হয়েছে।': 'Something went wrong.',
    'দুটি পাসওয়ার্ড মিলছে না।': 'The two passwords do not match.',
  };
  function translateErr(msg) {
    if (state.lang !== 'en') return msg;
    return ERROR_EN[msg] || msg;
  }

  // ---------------- utilities ----------------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtMoney(n) {
    n = Number(n) || 0;
    return '৳' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  function fmtDate(iso) {
    try {
      var d = new Date(iso + 'T00:00:00');
      var locale = state.lang === 'en' ? 'en-US' : 'bn-BD';
      return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch (e) { return iso; }
  }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  // কাস্টম, ব্র্যান্ড-স্টাইলের ক্যালেন্ডার — native তারিখ-picker-এর বদলে
  function dateFieldHtml(id, label, isoValue) {
    isoValue = isoValue || todayISO();
    return '<div class="field">' +
      '<label>' + esc(label) + '</label>' +
      dateInputBtnHtml(id, isoValue) +
      '</div>';
  }
  function dateInputBtnHtml(id, isoValue) {
    isoValue = isoValue || todayISO();
    return '<button type="button" class="date-input-btn" data-for="' + id + '">' +
      '<span class="date-input-text">' + fmtDate(isoValue) + '</span><span class="date-input-ic">📅</span>' +
      '</button>' +
      '<input type="hidden" id="' + id + '" value="' + esc(isoValue) + '">';
  }
  function dateInputBtnCompactHtml(id, isoValue) {
    isoValue = isoValue || todayISO();
    return '<button type="button" class="date-input-btn compact" data-for="' + id + '">' +
      '<span class="date-input-text">' + fmtDate(isoValue) + '</span>' +
      '</button>' +
      '<input type="hidden" id="' + id + '" value="' + esc(isoValue) + '">';
  }

  var BN_WEEKDAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  var EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var datePicker = { open: false, hiddenId: null, btn: null, year: 0, month: 0 };

  function closeDatePicker() {
    var el = document.getElementById('date-popover');
    if (el) el.remove();
    datePicker.open = false;
  }

  function datePopoverHtml() {
    var y = datePicker.year, m = datePicker.month;
    var hidden = document.getElementById(datePicker.hiddenId);
    var selectedIso = (hidden && hidden.value) || '';
    var todayIso = todayISO();
    var firstDow = new Date(y, m, 1).getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var monthYearLabel = new Intl.DateTimeFormat(state.lang === 'en' ? 'en-US' : 'bn-BD', { month: 'long', year: 'numeric' }).format(new Date(y, m, 1));
    var pad = function (n) { return String(n).padStart(2, '0'); };

    var cells = '';
    for (var i = 0; i < firstDow; i++) cells += '<span class="cal-cell empty"></span>';
    for (var d = 1; d <= daysInMonth; d++) {
      var iso = y + '-' + pad(m + 1) + '-' + pad(d);
      var cls = 'cal-cell' + (iso === selectedIso ? ' sel' : '') + (iso === todayIso ? ' today' : '');
      cells += '<button type="button" class="' + cls + '" data-iso="' + iso + '">' + d + '</button>';
    }

    var weekdays = state.lang === 'en' ? EN_WEEKDAYS : BN_WEEKDAYS;
    var weekHead = weekdays.map(function (w) { return '<span class="cal-dow">' + w + '</span>'; }).join('');

    return '' +
      '<div class="cal-head">' +
      '<button type="button" class="cal-nav" id="cal-prev" aria-label="' + esc(t('prevMonth')) + '">‹</button>' +
      '<span class="cal-month-label">' + monthYearLabel + '</span>' +
      '<button type="button" class="cal-nav" id="cal-next" aria-label="' + esc(t('nextMonth')) + '">›</button>' +
      '</div>' +
      '<div class="cal-grid cal-dow-row">' + weekHead + '</div>' +
      '<div class="cal-grid">' + cells + '</div>' +
      '<button type="button" class="cal-today-btn" id="cal-today">' + t('today') + '</button>';
  }

  function positionPopover(pop, btn) {
    var r = btn.getBoundingClientRect();
    var top = r.bottom + window.scrollY + 8;
    var left = r.left + window.scrollX;
    var maxLeft = window.scrollX + document.documentElement.clientWidth - 296;
    if (left > maxLeft) left = Math.max(8, maxLeft);
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
  }

  function renderDatePopover() {
    var existing = document.getElementById('date-popover');
    var pop = existing || document.createElement('div');
    pop.id = 'date-popover';
    pop.className = 'date-popover glass';
    pop.innerHTML = datePopoverHtml();
    if (!existing) document.body.appendChild(pop);
    positionPopover(pop, datePicker.btn);

    document.getElementById('cal-prev').onclick = function (e) {
      e.stopPropagation();
      datePicker.month -= 1;
      if (datePicker.month < 0) { datePicker.month = 11; datePicker.year -= 1; }
      renderDatePopover();
    };
    document.getElementById('cal-next').onclick = function (e) {
      e.stopPropagation();
      datePicker.month += 1;
      if (datePicker.month > 11) { datePicker.month = 0; datePicker.year += 1; }
      renderDatePopover();
    };
    document.getElementById('cal-today').onclick = function (e) {
      e.stopPropagation();
      selectDate(todayISO());
    };
    pop.querySelectorAll('.cal-cell[data-iso]').forEach(function (cell) {
      cell.onclick = function (e) { e.stopPropagation(); selectDate(cell.dataset.iso); };
    });
    pop.onclick = function (e) { e.stopPropagation(); };
  }

  function selectDate(iso) {
    var hidden = document.getElementById(datePicker.hiddenId);
    var btn = datePicker.btn;
    if (hidden) {
      hidden.value = iso;
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (btn) {
      var textEl = btn.querySelector('.date-input-text');
      if (textEl) textEl.textContent = fmtDate(iso);
    }
    closeDatePicker();
  }

  function setupDatePickers() {
    document.querySelectorAll('.date-input-btn').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var hiddenId = btn.dataset.for;
        if (datePicker.open && datePicker.hiddenId === hiddenId) { closeDatePicker(); return; }
        var hidden = document.getElementById(hiddenId);
        var iso = (hidden && hidden.value) || todayISO();
        var parts = iso.split('-').map(Number);
        datePicker = { open: true, hiddenId: hiddenId, btn: btn, year: parts[0], month: parts[1] - 1 };
        renderDatePopover();
      };
    });
  }
  document.addEventListener('click', function () { if (datePicker.open) closeDatePicker(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && datePicker.open) closeDatePicker(); });

  function monthKey(iso) { return (iso || '').slice(0, 7); }
  function monthLabel(key) {
    var p = key.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, 1);
    try { return new Intl.DateTimeFormat(state.lang === 'en' ? 'en-US' : 'bn-BD', { month: 'short' }).format(d); } catch (e) { return key; }
  }
  function initials(name) {
    return (name || '').trim().slice(0, 1).toUpperCase() || '?';
  }
  // ছবি বসানোর জায়গা — ফাইল না থাকলে (404) স্বয়ংক্রিয়ভাবে placeholder দেখায়।
  // পরে আসল ছবি বসাতে হলে ঠিক এই path-এ ফাইলটি রাখলেই হবে।
  function imageSlot(path, label, opts) {
    opts = opts || {};
    var cls = 'image-slot' + (opts.dark ? ' on-dark' : '') + (opts.extraClass ? ' ' + opts.extraClass : '');
    return '<div class="' + cls + '">' +
      '<img src="' + esc(path) + '" alt="" onerror="this.closest(\'.image-slot\').classList.add(\'slot-empty\')">' +
      '<div class="slot-placeholder"><span class="ic">🖼️</span><span>' + esc(label) + '</span><code>' + esc(path) + '</code></div>' +
      '</div>';
  }

  // সাজসজ্জার গরু illustration — flat, cute, একই ভিজ্যুয়াল স্টাইলে পুরো সাইটে ব্যবহৃত হয়
  var cowSvgId = 0;
  function cowSvg(opts) {
    opts = opts || {};
    var size = opts.size || 64;
    var walking = opts.walking !== false;
    var uid = 'cow' + (++cowSvgId);
    return '' +
      '<svg class="cow-illust ' + (walking ? 'walking' : 'standing') + '" data-uid="' + uid + '" width="' + size + '" height="' + Math.round(size * 0.62) + '" viewBox="0 0 120 76" aria-hidden="true">' +
      '<ellipse class="cow-shadow" cx="60" cy="70" rx="34" ry="4"/>' +
      '<g class="leg leg-bl"><rect x="40" y="46" width="9" height="24" rx="4"/></g>' +
      '<g class="leg leg-fr"><rect x="83" y="46" width="9" height="24" rx="4"/></g>' +
      '<g class="leg leg-br"><rect x="52" y="46" width="9" height="24" rx="4"/></g>' +
      '<g class="leg leg-fl"><rect x="71" y="46" width="9" height="24" rx="4"/></g>' +
      '<path class="cow-tail" d="M40 34 Q28 40 30 54" fill="none" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse class="cow-body" cx="62" cy="38" rx="34" ry="19"/>' +
      '<path class="cow-patch" d="M46 24c6-4 14-2 15 5-3 5-13 6-18 1-2-3-1-4 3-6z"/>' +
      '<path class="cow-patch" d="M74 44c5-2 11 0 12 5-2 4-10 5-14 1-2-2-1-4 2-6z"/>' +
      '<circle class="cow-body" cx="26" cy="28" r="15"/>' +
      '<ellipse class="cow-ear" cx="15" cy="17" rx="5" ry="7" transform="rotate(-25 15 17)"/>' +
      '<ellipse class="cow-ear" cx="34" cy="15" rx="5" ry="7" transform="rotate(20 34 15)"/>' +
      '<ellipse class="cow-muzzle" cx="17" cy="33" rx="9" ry="7"/>' +
      '<circle class="cow-nostril" cx="13" cy="33" r="1.3"/>' +
      '<circle class="cow-nostril" cx="20" cy="34" r="1.3"/>' +
      '<circle class="cow-eye" cx="24" cy="23" r="1.6"/>' +
      '</svg>';
  }
  // ছোট্ট "হাই" বলা গরু — বন্ধুত্বপূর্ণ greeting illustration-এর জন্য
  function cowWaveSvg(size) {
    size = size || 56;
    return '' +
      '<svg class="cow-illust cow-wave" width="' + size + '" height="' + Math.round(size * 0.9) + '" viewBox="0 0 90 90" aria-hidden="true">' +
      '<ellipse class="cow-shadow" cx="44" cy="84" rx="22" ry="4"/>' +
      '<g class="leg"><rect x="34" y="62" width="8" height="18" rx="4"/></g>' +
      '<g class="leg"><rect x="50" y="62" width="8" height="18" rx="4"/></g>' +
      '<ellipse class="cow-body" cx="44" cy="56" rx="25" ry="20"/>' +
      '<path class="cow-patch" d="M30 46c5-4 12-2 13 4-3 4-11 5-15 1-2-2-1-3 2-5z"/>' +
      '<g class="cow-wave-arm">' +
      '<rect class="cow-body" x="60" y="30" width="9" height="24" rx="4.5" transform="rotate(18 64.5 42)"/>' +
      '<ellipse class="cow-muzzle" cx="66" cy="26" rx="6" ry="5.5"/>' +
      '</g>' +
      '<circle class="cow-body" cx="34" cy="26" r="16"/>' +
      '<ellipse class="cow-ear" cx="22" cy="15" rx="5" ry="7" transform="rotate(-25 22 15)"/>' +
      '<ellipse class="cow-ear" cx="42" cy="13" rx="5" ry="7" transform="rotate(20 42 13)"/>' +
      '<ellipse class="cow-muzzle" cx="25" cy="31" rx="9" ry="7"/>' +
      '<circle class="cow-nostril" cx="21" cy="31" r="1.3"/>' +
      '<circle class="cow-nostril" cx="28" cy="32" r="1.3"/>' +
      '<circle class="cow-eye" cx="32" cy="21" r="1.7"/>' +
      '</svg>';
  }
  function grassSvg(size) {
    size = size || 36;
    return '<svg class="grass-illust" width="' + size + '" height="' + Math.round(size * 0.5) + '" viewBox="0 0 60 30" aria-hidden="true">' +
      '<path d="M6 30C4 20 8 10 14 3" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M18 30C17 18 22 8 29 2" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M30 30C31 20 27 10 22 4" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M42 30C41 18 46 9 53 4" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M50 30C51 20 48 12 44 7" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>';
  }

  function api(path, opts) {
    opts = opts || {};
    var fetchOpts = {
      method: opts.method || 'GET',
      credentials: 'include',
      headers: {},
    };
    if (opts.body) {
      fetchOpts.headers['Content-Type'] = 'application/json';
      fetchOpts.body = JSON.stringify(opts.body);
    }
    return fetch(path, fetchOpts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || 'একটি সমস্যা হয়েছে।');
          throw err;
        }
        return data;
      });
    });
  }

  // ---------------- render dispatch ----------------
  function render() {
    closeDatePicker();
    if (!state.user) {
      root.innerHTML = renderAuth();
      wireAuth();
    } else {
      root.innerHTML = renderApp();
      wireApp();
    }
    setupScrollEffects();
    setupDatePickers();
  }

  // ---------------- স্ক্রলে subtle reveal + parallax ----------------
  var revealObserver = null;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setupScrollEffects() {
    if (reducedMotion || !window.IntersectionObserver) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in-view'); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px 150px 0px' });
    }
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
    applyParallax();
  }
  function applyParallax() {
    var y = window.scrollY || 0;
    document.querySelectorAll('.parallax .hero-image-frame').forEach(function (el) {
      el.style.transform = 'translateY(' + Math.min(y * 0.06, 22) + 'px)';
    });
  }
  if (!reducedMotion) window.addEventListener('scroll', applyParallax, { passive: true });

  // ================= AUTH SCREEN =================
  function authScene() {
    return '' +
      '<div class="auth-scene">' +
      '<div class="ground"></div>' +
      '<div class="grass-row">' + grassSvg(40) + grassSvg(30) + grassSvg(44) + grassSvg(32) + grassSvg(38) + '</div>' +
      '<div class="cow-track t1"><div class="cow-mover" style="animation-duration:26s;">' + cowSvg({ size: 70 }) + '</div></div>' +
      '<div class="cow-track t2 rev"><div class="cow-mover" style="animation-duration:34s;animation-delay:-6s;">' + cowSvg({ size: 52 }) + '</div></div>' +
      '<div class="cow-track t3"><div class="cow-mover" style="animation-duration:42s;animation-delay:-14s;">' + cowSvg({ size: 40 }) + '</div></div>' +
      '</div>';
  }

  // লগইন/সাইনআপ পেজের ব্র্যান্ড — গরুর আইকন লেখার উপরে, স্থির জায়গায় থেকে শুধু পা নাড়িয়ে হাঁটে (কোনো সরাসরি সরে যাওয়া নেই)
  function authBrandmarkHtml(withTagline) {
    return '<div class="auth-brandmark">' +
      '<span class="auth-brand-icon">' + cowSvg({ size: 60, walking: true }) + '</span>' +
      '<span class="auth-brand-text">' + t('appName') + '</span>' +
      (withTagline ? '<span class="auth-tagline">' + t('tagline') + '</span>' : '') +
      '</div>';
  }

  function renderAuth() {
    if (state.authMode === 'forgot') return renderForgotPassword();
    if (state.authMode === 'verify-code') return renderVerifyCode();
    if (state.authMode === 'reset') return renderResetPassword();
    var isLogin = state.authMode === 'login';
    var err = state.authError ? '<div class="form-error">' + esc(state.authError) + '</div>' : '';
    var notice = state.authNotice ? '<div class="form-notice">' + esc(state.authNotice) + '</div>' : '';
    var googleBtn = state.googleEnabled
      ? '<button type="button" class="btn secondary" id="btn-google">' + t('continueWithGoogle') + '</button>'
      : '<button class="btn secondary" disabled title="' + esc(t('continueWithGoogleSoon')) + '">' + t('continueWithGoogleSoon') + '</button>';

    var af = state.authFields;
    var formFields = isLogin
      ? '<div class="field"><label for="f-email">' + t('email') + '</label><input id="f-email" type="email" autocomplete="email" value="' + esc(af.email) + '" required></div>'
        + '<div class="field"><div class="field-row-between"><label for="f-password">' + t('password') + '</label><button type="button" class="link-btn" id="link-forgot">' + t('forgotPassword') + '</button></div>' + passwordFieldHtml('f-password', af.password, 'current-password') + '</div>'
      : '<div class="field"><label for="f-name">' + t('name') + '</label><input id="f-name" type="text" autocomplete="name" value="' + esc(af.name) + '" required></div>'
        + '<div class="field"><label for="f-email">' + t('email') + '</label><input id="f-email" type="email" autocomplete="email" value="' + esc(af.email) + '" required></div>'
        + '<div class="field"><label for="f-password">' + t('password') + '</label>' + passwordFieldHtml('f-password', af.password, 'new-password') + '</div>'
        + '<div class="field"><label for="f-password2">' + t('passwordAgain') + '</label>' + passwordFieldHtml('f-password2', af.password2, 'new-password') + '</div>';

    return '' +
      '<div class="auth-shell">' +
      authScene() +
      '<div class="auth-panel">' +
      authBrandmarkHtml(true) +
      '<div class="auth-card">' +
      '<div class="kicker">' + (isLogin ? t('welcome') : t('newAccount')) + '</div>' +
      '<h1>' + (isLogin ? t('login') : t('createAccount')) + '</h1>' +
      notice + err +
      '<form id="auth-form">' + formFields +
      '<button type="submit" class="btn" ' + (state.authBusy ? 'disabled' : '') + '>' + (isLogin ? t('login') : t('signup')) + '</button>' +
      '</form>' +
      '<div class="divider">' + t('or') + '</div>' +
      googleBtn +
      '<div class="auth-switch">' + (isLogin
        ? t('newHere') + ' <button id="switch-auth">' + t('createAccount') + '</button>'
        : t('alreadyHaveAccount') + ' <button id="switch-auth">' + t('login') + '</button>') +
      '</div>' +
      '</div></div>' +
      '</div>';
  }

  function renderForgotPassword() {
    var err = state.authError ? '<div class="form-error">' + esc(state.authError) + '</div>' : '';
    var notice = state.authNotice ? '<div class="form-notice">' + esc(state.authNotice) + '</div>' : '';
    return '' +
      '<div class="auth-shell">' + authScene() +
      '<div class="auth-panel">' + authBrandmarkHtml(false) + '<div class="auth-card">' +
      '<div class="kicker">' + t('accountRecovery') + '</div>' +
      '<h1>' + t('forgotPassword') + '</h1>' +
      '<p style="color:var(--ink-dim);margin-bottom:18px;font-size:.92rem;">' + (state.lang === 'en' ? 'Enter your email — a 6-digit verification code will be sent to it.' : 'আপনার ইমেইল দিন — একটি ৬-সংখ্যার ভেরিফিকেশন কোড পাঠানো হবে।') + '</p>' +
      notice + err +
      '<form id="forgot-form">' +
      '<div class="field"><label for="fp-email">' + t('email') + '</label><input id="fp-email" type="email" autocomplete="email" value="' + esc(state.resetEmail) + '" required></div>' +
      '<button type="submit" class="btn" ' + (state.authBusy ? 'disabled' : '') + '>' + t('sendResetLink') + '</button>' +
      '</form>' +
      '<div class="auth-switch"><button id="switch-auth">' + t('backToLogin') + '</button></div>' +
      '</div></div></div>';
  }

  function renderVerifyCode() {
    var err = state.authError ? '<div class="form-error">' + esc(state.authError) + '</div>' : '';
    var notice = state.authNotice ? '<div class="form-notice">' + esc(state.authNotice) + '</div>' : '';
    return '' +
      '<div class="auth-shell">' + authScene() +
      '<div class="auth-panel">' + authBrandmarkHtml(false) + '<div class="auth-card">' +
      '<div class="kicker">' + t('accountRecovery') + '</div>' +
      '<h1>' + t('enterCodeHeading') + '</h1>' +
      '<p style="color:var(--ink-dim);margin-bottom:18px;font-size:.92rem;">' + t('enterCodeDesc') + ' <strong>' + esc(state.resetEmail) + '</strong></p>' +
      notice + err +
      '<form id="verify-code-form">' +
      '<div class="field"><label for="vc-code">' + t('verificationCode') + '</label><input id="vc-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" style="letter-spacing:6px;font-size:1.3rem;text-align:center;font-weight:700;" required></div>' +
      '<button type="submit" class="btn" ' + (state.authBusy ? 'disabled' : '') + '>' + t('verifyCode') + '</button>' +
      '</form>' +
      '<div class="auth-switch">' +
      '<button id="resend-code" type="button">' + t('resendCode') + '</button> · ' +
      '<button id="switch-auth">' + t('backToLogin') + '</button>' +
      '</div>' +
      '</div></div></div>';
  }

  function renderResetPassword() {
    var err = state.authError ? '<div class="form-error">' + esc(state.authError) + '</div>' : '';
    return '' +
      '<div class="auth-shell">' + authScene() +
      '<div class="auth-panel">' + authBrandmarkHtml(false) + '<div class="auth-card">' +
      '<div class="kicker">' + t('newPassword') + '</div>' +
      '<h1>' + t('resetPassword') + '</h1>' +
      err +
      '<form id="reset-form">' +
      '<div class="field"><label for="rp-password">' + t('newPassword') + '</label>' + passwordFieldHtml('rp-password', '', 'new-password') + '</div>' +
      '<div class="field"><label for="rp-password2">' + t('passwordAgain') + '</label>' + passwordFieldHtml('rp-password2', '', 'new-password') + '</div>' +
      '<button type="submit" class="btn" ' + (state.authBusy ? 'disabled' : '') + '>' + t('savePassword') + '</button>' +
      '</form>' +
      '<div class="auth-switch"><button id="switch-auth">' + t('backToLogin') + '</button></div>' +
      '</div></div></div>';
  }

  function goToLogin() {
    state.authMode = 'login'; state.authError = ''; state.authNotice = ''; state.resetToken = null; state.resetEmail = '';
    if (window.history && window.history.replaceState) window.history.replaceState({}, '', '/');
    render();
  }

  function wireAuth() {
    if (state.authMode === 'forgot') {
      document.getElementById('forgot-form').onsubmit = function (e) {
        e.preventDefault();
        state.authError = ''; state.authBusy = true; render();
        var email = document.getElementById('fp-email').value.trim();
        state.resetEmail = email;
        api('/api/auth/forgot-password', { method: 'POST', body: { email: email } })
          .then(function () {
            state.authBusy = false; state.authNotice = '';
            state.authMode = 'verify-code';
            render();
          })
          .catch(function (err) { state.authBusy = false; state.authError = translateErr(err.message); render(); });
      };
      document.getElementById('switch-auth').onclick = goToLogin;
      return;
    }
    if (state.authMode === 'verify-code') {
      document.getElementById('verify-code-form').onsubmit = function (e) {
        e.preventDefault();
        var code = document.getElementById('vc-code').value.trim();
        state.authError = ''; state.authBusy = true; render();
        api('/api/auth/verify-reset-code', { method: 'POST', body: { email: state.resetEmail, code: code } })
          .then(function (data) {
            state.authBusy = false;
            state.resetToken = data.resetToken;
            state.authMode = 'reset';
            state.authNotice = t('codeVerified');
            render();
          })
          .catch(function (err) { state.authBusy = false; state.authError = translateErr(err.message); render(); });
      };
      var resendBtn = document.getElementById('resend-code');
      if (resendBtn) resendBtn.onclick = function () {
        state.authError = ''; state.authBusy = true; render();
        api('/api/auth/forgot-password', { method: 'POST', body: { email: state.resetEmail } })
          .then(function () {
            state.authBusy = false; state.authNotice = t('codeResent');
            render();
          })
          .catch(function (err) { state.authBusy = false; state.authError = translateErr(err.message); render(); });
      };
      document.getElementById('switch-auth').onclick = goToLogin;
      return;
    }
    if (state.authMode === 'reset') {
      document.getElementById('reset-form').onsubmit = function (e) {
        e.preventDefault();
        var p1 = document.getElementById('rp-password').value;
        var p2 = document.getElementById('rp-password2').value;
        if (p1 !== p2) { state.authError = t('passwordMismatch'); return render(); }
        state.authError = ''; state.authBusy = true; render();
        api('/api/auth/reset-password', { method: 'POST', body: { token: state.resetToken, password: p1 } })
          .then(function () {
            state.authBusy = false;
            state.authMode = 'login';
            state.authNotice = 'পাসওয়ার্ড পরিবর্তন হয়েছে — এখন লগইন করুন।';
            state.resetToken = null;
            state.resetEmail = '';
            if (window.history && window.history.replaceState) window.history.replaceState({}, '', '/');
            render();
          })
          .catch(function (err) { state.authBusy = false; state.authError = translateErr(err.message); render(); });
      };
      document.getElementById('switch-auth').onclick = goToLogin;
      return;
    }
    var form = document.getElementById('auth-form');
    ['f-name', 'f-email', 'f-password', 'f-password2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.oninput = function () { state.authFields[id.slice(2)] = el.value; };
    });
    form.onsubmit = function (e) {
      e.preventDefault();
      state.authError = '';
      var email = document.getElementById('f-email').value.trim();
      var password = document.getElementById('f-password').value;
      if (state.authMode === 'signup') {
        var name = document.getElementById('f-name').value.trim();
        var password2 = document.getElementById('f-password2').value;
        if (password !== password2) {
          state.authError = t('passwordMismatch');
          return render();
        }
        state.authBusy = true; render();
        api('/api/auth/signup', { method: 'POST', body: { name: name, email: email, password: password } })
          .then(onAuthed)
          .catch(function (err) { state.authBusy = false; state.authError = translateErr(err.message); render(); });
      } else {
        state.authBusy = true; render();
        api('/api/auth/login', { method: 'POST', body: { email: email, password: password } })
          .then(onAuthed)
          .catch(function (err) { state.authBusy = false; state.authError = translateErr(err.message); render(); });
      }
    };
    var switchBtn = document.getElementById('switch-auth');
    if (switchBtn) switchBtn.onclick = function () {
      state.authMode = state.authMode === 'login' ? 'signup' : 'login';
      state.authError = ''; state.authNotice = '';
      render();
    };
    var forgotLink = document.getElementById('link-forgot');
    if (forgotLink) forgotLink.onclick = function () {
      state.authMode = 'forgot'; state.authError = ''; state.authNotice = '';
      render();
    };
    var googleBtn = document.getElementById('btn-google');
    if (googleBtn) googleBtn.onclick = startGoogleLogin;
  }

  // Capacitor অ্যাপের ভেতরের WebView-তে Google OAuth সরাসরি খোলা যায় না — Google নিজেই
  // embedded WebView block করে (Error 403: disallowed_useragent)। তাই native app হলে system
  // browser-এ (Chrome Custom Tabs) খোলা হয়; ওয়েবে সাধারণ পেজ-নেভিগেশনই যথেষ্ট।
  function isNativeApp() {
    // পোর্টফোলিও প্রিভিউ-only addition: এই কপিতে আসল Capacitor নেই, তাই দুইটা মোবাইল mockup
    // (Website vs App) আলাদা করতে "Mobile App" iframe-টা ?embed=app প্যারামিটার দিয়ে লোড হয় —
    // সেটা থাকলে native app হিসেবেই ধরা হয়, ফলে সেখানে "Download App" অপশন দেখায় না।
    // আসল লাইভ অ্যাপের এই ফাংশন অপরিবর্তিত (শুধু নিচের preview-only চেকটা এখানে যোগ করা)।
    if (typeof location !== 'undefined' && /[?&]embed=app(&|$)/.test(location.search)) return true;
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }
  function startGoogleLogin() {
    if (isNativeApp() && window.Capacitor.Plugins.Browser) {
      window.Capacitor.Plugins.Browser.open({ url: location.origin + '/api/auth/google?platform=mobile' });
    } else {
      window.location.href = '/api/auth/google';
    }
  }

  function onAuthed(data) {
    state.user = data.user;
    state.authBusy = false;
    state.authError = '';
    state.authFields = { name: '', email: '', password: '', password2: '' };
    state.view = 'dashboard';
    if (window.history) history.replaceState({}, '', '#');
    loadFarms().then(loadRecentActivity).then(render);
    loadFarmTypes();
    render();
    // বড় "গরু উপরে উঠে আসা" animation ইচ্ছাকৃতভাবে বন্ধ — শুধু হিরো টাইটেলের পাশের ছোট
    // হাত-নাড়ানো গরুর আইকন (cowWaveSvg, renderDashboard-এ) থাকবে, এটাই যথেষ্ট।
  }

  // ---------------- নেভিগেশন — browser/device native Back বাটনের support-এর জন্য ----------------
  function pushHash(hash) {
    if (window.history && location.hash !== hash) history.pushState({ hash: hash }, '', hash || '#');
  }
  function goDashboard(push) {
    state.view = 'dashboard'; state.currentFarm = null;
    if (push !== false) pushHash('#');
    render();
    loadFarms().then(loadRecentActivity).then(render);
  }
  function goReports(push) {
    state.view = 'reports'; state.currentFarm = null;
    if (push !== false) pushHash('#reports');
    render();
    Promise.all([loadFarms(), loadReportEntries()]).then(render);
  }
  function goSettings(push) {
    state.view = 'settings'; state.currentFarm = null;
    if (push !== false) pushHash('#settings');
    render();
  }
  function doLogout() {
    return api('/api/auth/logout', { method: 'POST' }).then(function () {
      state.user = null; state.farms = []; state.currentFarm = null; state.view = 'dashboard';
      state.authMode = 'login'; state.authError = ''; state.authNotice = '';
      state.authFields = { name: '', email: '', password: '', password2: '' };
      if (window.history && window.history.replaceState) window.history.replaceState({}, '', '#');
      render();
    });
  }
  function goHistory(push) {
    state.view = 'history'; state.currentFarm = null;
    if (push !== false) pushHash('#history');
    render();
    loadReportEntries().then(render);
  }
  function goDownloadApp(push) {
    state.view = 'download'; state.currentFarm = null;
    if (push !== false) pushHash('#download');
    render();
  }
  window.addEventListener('popstate', function () {
    if (!state.user) return;
    var hash = location.hash;
    if (hash.indexOf('#farm/') === 0) openFarm(hash.slice(6), false);
    else if (hash === '#reports') goReports(false);
    else if (hash === '#settings') goSettings(false);
    else if (hash === '#history') goHistory(false);
    else if (hash === '#download') goDownloadApp(false);
    else goDashboard(false);
  });

  // ---------------- ফোনের সিস্টেম Back বাটন — অ্যাপের ভেতরের নেভিগেশন history ব্যবহার করে,
  // খোলা থাকা ফর্ম/মোডাল আগে বন্ধ করে, একদম শুরুতে থাকলে তবেই অ্যাপ বন্ধ করে ----------------
  function handleHardwareBack() {
    if (state.newFarmModalOpen) { state.newFarmModalOpen = false; state.newFarm = { type: null, name: '', budget: '' }; render(); return; }
    if (state.categoryBudgetModalOpen) { state.categoryBudgetModalOpen = false; state.activeQuickAction = null; render(); return; }
    if (state.editFarmOpen) { state.editFarmOpen = false; render(); return; }
    if (state.showEntryForm || state.editingEntryId) { state.showEntryForm = false; state.editingEntryId = null; state.activeQuickAction = null; render(); return; }
    if (state.quickAddType) { state.quickAddType = null; state.activeQuickAction = null; render(); return; }
    if (window.history && window.history.length > 1 && (state.view !== 'dashboard' || location.hash)) {
      window.history.back();
      return;
    }
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
      window.Capacitor.Plugins.App.exitApp();
    }
  }
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', handleHardwareBack);
  }

  // ---------------- Google লগইন — system browser থেকে ফেরার deep link (com.barakaagro.app://auth-callback?ticket=...) ----------------
  // system browser-এ OAuth শেষ হওয়ার পর server এই কাস্টম স্কিমে redirect করে; Android সেটা ধরে app-এ ফেরত পাঠায়,
  // এখানে সেই এক-বার-ব্যবহারযোগ্য টিকেট দিয়ে আসল সেশন বসানো হয় এবং system browser ট্যাবটা বন্ধ করে দেওয়া হয়।
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('appUrlOpen', function (data) {
      var url = data && data.url;
      if (!url || url.indexOf('auth-callback') === -1) return;
      var ticket = null;
      try { ticket = new URL(url).searchParams.get('ticket'); } catch (e) {}
      if (!ticket) return;
      api('/api/auth/redeem-ticket', { method: 'POST', body: { ticket: ticket } })
        .then(function (data) {
          if (window.Capacitor.Plugins.Browser) window.Capacitor.Plugins.Browser.close().catch(function () {});
          onAuthed(data);
        })
        .catch(function (err) {
          if (window.Capacitor.Plugins.Browser) window.Capacitor.Plugins.Browser.close().catch(function () {});
          state.authError = translateErr(err.message);
          render();
        });
    });
  }

  // ================= APP SHELL =================
  function renderApp() {
    var navItems = [
      { key: 'dashboard', label: t('dashboard'), icon: '🏠' },
      { key: 'reports', label: t('reports'), icon: '📊' },
      { key: 'settings', label: t('settings'), icon: '⚙️' },
      { key: 'history', label: t('history'), icon: '🗓️' },
    ];
    // "অ্যাপ ডাউনলোড" অপশনটা শুধু ওয়েবসাইটে দেখানো হয় — নিজের Android app-এর ভেতর থেকে নিজেকেই
    // ডাউনলোড করার কোনো মানে নেই, তাই Capacitor native app-এ এটা বাদ দেওয়া হয়
    if (!isNativeApp()) {
      navItems.push({ key: 'download', label: t('downloadApp'), icon: '📥' });
    }
    function isActive(key) {
      return state.view === key || (key === 'dashboard' && state.view === 'farm');
    }
    var sideNav = navItems.map(function (n) {
      return '<button data-nav="' + n.key + '" class="' + (isActive(n.key) ? 'active' : '') + '"><span class="ic">' + n.icon + '</span><span>' + n.label + '</span></button>';
    }).join('');
    var bottomNav = navItems.map(function (n) {
      return '<button data-nav="' + n.key + '" class="' + (isActive(n.key) ? 'active' : '') + '"><span class="ic">' + n.icon + '</span><span>' + n.label + '</span></button>';
    }).join('');

    var body;
    if (state.view === 'farm') body = renderFarmDetail();
    else if (state.view === 'reports') body = renderReports();
    else if (state.view === 'settings') body = renderSettings();
    else if (state.view === 'history') body = renderHistory();
    else if (state.view === 'download') body = renderDownloadApp();
    else body = renderDashboard();

    return '' +
      '<div class="app-shell">' +
      '<aside class="sidebar">' +
      '<div class="sidebar-brand">🐄 ' + t('appName') + '</div>' +
      '<nav class="sidebar-nav">' + sideNav + '</nav>' +
      '<div class="sidebar-user">' +
      '<div class="avatar"' + (state.user.avatarColor ? ' style="background:' + esc(state.user.avatarColor) + '"' : '') + '>' + esc(initials(state.user.name)) + '</div>' +
      '<div class="meta"><div class="name">' + esc(state.user.name) + '</div><div class="email">' + esc(state.user.email) + '</div></div>' +
      '<button class="logout-ic" id="btn-logout" title="' + esc(t('logout')) + '" aria-label="' + esc(t('logout')) + '">' + LOGOUT_ICON_SVG + '</button>' +
      '</div>' +
      '</aside>' +
      '<div class="main-col">' +
      '<header class="topbar-mobile">' +
      '<div class="brandmark">🐄 ' + t('appName') + '</div>' +
      '<div class="who"><div class="avatar"' + (state.user.avatarColor ? ' style="background:' + esc(state.user.avatarColor) + '"' : '') + '>' + esc(initials(state.user.name)) + '</div>' +
      '<button class="logout-ic" id="btn-logout-mobile" title="' + esc(t('logout')) + '" aria-label="' + esc(t('logout')) + '">' + LOGOUT_ICON_SVG + '</button></div>' +
      '</header>' +
      '<main class="content">' + body + '</main>' +
      '<nav class="bottom-nav"><div class="row">' + bottomNav + '</div></nav>' +
      '</div>' +
      '</div>';
  }

  function wireApp() {
    document.querySelectorAll('[data-nav]').forEach(function (btn) {
      btn.onclick = function () {
        var v = btn.dataset.nav;
        if (v === 'reports') goReports();
        else if (v === 'settings') goSettings();
        else if (v === 'history') goHistory();
        else if (v === 'download') goDownloadApp();
        else goDashboard();
      };
    });
    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.onclick = doLogout;
    var logoutBtnMobile = document.getElementById('btn-logout-mobile');
    if (logoutBtnMobile) logoutBtnMobile.onclick = doLogout;

    if (state.view === 'farm') wireFarmDetail();
    else if (state.view === 'reports') wireReports();
    else if (state.view === 'history') wireHistory();
    else if (state.view === 'settings') wireSettings();
    else wireDashboard();
  }

  // ================= DASHBOARD =================
  function aggregateTotals() {
    var budget = 0, income = 0, expense = 0, count = 0;
    state.farms.forEach(function (f) {
      budget += Number(f.budget) || 0;
      income += f.totals.income;
      expense += f.totals.expense;
      count += Number(f.totals.count) || 0;
    });
    var net = income - expense;
    return { budget: budget, income: income, expense: expense, net: net, count: count, profit: net >= 0 ? net : 0, loss: net < 0 ? -net : 0 };
  }

  function finTickerHtml() {
    var tot = aggregateTotals();
    var items = [
      { label: t('totalBudget'), value: tot.budget, cls: '' },
      { label: t('totalExpense'), value: tot.expense, cls: 'expense' },
      { label: t('totalIncome'), value: tot.income, cls: 'income' },
      { label: t('totalProfit'), value: tot.profit, cls: 'income' },
      { label: t('totalLoss'), value: tot.loss, cls: 'expense' },
    ];
    function card(it) {
      return '<div class="fin-card glass"><div class="fin-label">' + it.label + '</div><div class="fin-value num ' + it.cls + '">' + fmtMoney(it.value) + '</div></div>';
    }
    var row = items.map(card).join('');
    return '<div class="fin-ticker"><div class="fin-track">' + row + row + '</div></div>';
  }

  function renderDashboard() {
    var hasFamily = state.farms.some(function (f) { return f.type === 'family'; });
    var familyCardHtml = hasFamily ? '' :
      '<button class="farm-card family-card" id="btn-add-family">' +
      '<span class="icon-badge">' + FAMILY_ICON + '</span>' +
      '<span class="name">' + t('family') + '</span>' +
      '<span class="type">' + t('familyAccounting') + '</span>' +
      '<span class="open-hint">' + t('getStarted') + '</span>' +
      '</button>';

    var farmsHtml;
    if (state.farms.length === 0) {
      farmsHtml = '<div class="empty-state"><div class="icon">🐄</div>' +
        '<h2 style="font-size:1.2rem;">' + t('noFarmsYet') + '</h2>' +
        '<p>' + t('noFarmsDesc') + '</p>' +
        '<div class="row" style="justify-content:center;gap:10px;">' +
        '<button class="btn block-auto" id="btn-add-farm-empty">' + t('addFirstFarm') + '</button>' +
        '<button class="btn secondary block-auto" id="btn-add-family">' + FAMILY_ICON + ' ' + t('startFamily') + '</button>' +
        '</div>' +
        '</div>';
    } else {
      farmsHtml = '<div class="farm-grid">' + state.farms.map(function (f) {
        var lbl = typeLabel(FARM_TYPE_LABELS[f.type] || FARM_TYPE_LABELS.other);
        return '<button class="farm-card" data-id="' + f.id + '">' +
          '<span class="icon-badge">' + esc(farmDisplayIcon(f)) + '</span>' +
          '<span class="name">' + esc(f.name) + '</span>' +
          '<span class="type">' + esc(lbl) + '</span>' +
          '<span class="open-hint">' + t('openFarm') + '</span>' +
          '</button>';
      }).join('') +
        familyCardHtml +
        '<button class="add-farm-card" id="btn-add-farm"><span class="plus">+</span><span>' + t('addNewFarm') + '</span></button>' +
        '</div>';
    }

    var activityHtml;
    if (state.recentActivity.length === 0) {
      activityHtml = '';
    } else {
      activityHtml = '<div class="section-title"><h2>' + t('recentActivity') + '</h2></div>' +
        '<div class="activity-list">' + state.recentActivity.map(function (e) {
          return '<div class="activity-row">' +
            '<div class="ic">' + esc(entryFarmIcon(e)) + '</div>' +
            '<div class="meta"><div class="t1">' + esc(catLabel(e.category)) + '</div><div class="t2">' + esc(e.farmName) + ' · ' + fmtDate(e.date) + '</div></div>' +
            '<div class="amt num ' + e.type + '">' + (e.type === 'income' ? '+' : '-') + fmtMoney(e.amount) + '</div>' +
            '</div>';
        }).join('') + '</div>';
    }

    var ft = aggregateTotals();
    var farmCount = state.farms.length;
    return '' +
      '<section class="hero-split">' +
      '<div class="hero-text">' +
      '<div class="hero-kicker">' + t('hello') + ', ' + esc(state.user.name) + ' ' + cowWaveSvg(36) + '</div>' +
      '<h1 class="hero-title">' + t('welcomeToApp').replace(/\.$/, '') + '</h1>' +
      '<p class="hero-desc">' + t('heroDesc') + '</p>' +
      '<span class="hero-tagline-badge glass">' + t('heroTagline') + '</span>' +
      '</div>' +
      '<div class="hero-image-wrap parallax">' +
      imageSlot('img/dashboard-banner.jpg', 'এখানে খামারের ছবি বসবে', { extraClass: 'hero-image-frame' }) +
      '<div class="float-badge glass b1"><span class="fb-ic">🐄</span><span class="fb-text"><span class="fb-label">' + t('farmManagement') + '</span></span></div>' +
      '<div class="float-badge glass b2"><span class="fb-ic">💰</span><span class="fb-text"><span class="fb-label">' + t('totalIncome') + '</span><span class="fb-value">৳' + ft.income.toLocaleString('en-US') + '</span></span></div>' +
      '<div class="float-badge glass b3"><span class="fb-ic">🧾</span><span class="fb-text"><span class="fb-label">' + t('totalExpense') + '</span><span class="fb-value">৳' + ft.expense.toLocaleString('en-US') + '</span></span></div>' +
      '<div class="float-badge glass b4"><span class="fb-ic">📋</span><span class="fb-text"><span class="fb-label">' + t('totalRecords') + '</span><span class="fb-value">' + farmCount + '</span></span></div>' +
      '</div>' +
      '</section>' +
      finTickerHtml() +
      '<div class="site-summary-grid">' +
      '<div class="summary-box"><span class="summary-ic">💰</span><div class="label">' + t('totalBudget') + '</div><div class="value num">' + fmtMoney(ft.budget) + '</div></div>' +
      '<div class="summary-box income"><span class="summary-ic">📈</span><div class="label">' + t('totalIncome') + '</div><div class="value num">' + fmtMoney(ft.income) + '</div></div>' +
      '<div class="summary-box expense"><span class="summary-ic">📉</span><div class="label">' + t('totalExpense') + '</div><div class="value num">' + fmtMoney(ft.expense) + '</div></div>' +
      '<div class="summary-box ' + (ft.net >= 0 ? 'income' : 'expense') + '"><span class="summary-ic">' + (ft.net >= 0 ? '📈' : '📉') + '</span><div class="label">' + (ft.net >= 0 ? t('totalProfit') : t('totalLoss')) + '</div><div class="value num">' + fmtMoney(Math.abs(ft.net)) + '</div></div>' +
      '</div>' +
      '<div class="section-title"><h2>' + t('myFarms') + '</h2></div>' +
      '<p style="color:var(--ink-dim);margin:-6px 0 14px;">' + t('myFarmsDesc') + '</p>' +
      farmsHtml +
      (activityHtml ? '<div style="margin-top:30px;">' + activityHtml + '</div>' : '') +
      renderFooterScene() +
      renderNewFarmModal();
  }

  function wireDashboard() {
    document.querySelectorAll('.farm-card:not(.family-card)').forEach(function (btn) {
      btn.onclick = function () { openFarm(btn.dataset.id); };
    });
    var addBtn = document.getElementById('btn-add-farm') || document.getElementById('btn-add-farm-empty');
    if (addBtn) addBtn.onclick = function () { state.newFarmModalOpen = true; state.newFarm = { type: null, name: '', budget: '' }; render(); };
    var addFamilyBtn = document.getElementById('btn-add-family');
    if (addFamilyBtn) addFamilyBtn.onclick = function () {
      addFamilyBtn.disabled = true;
      api('/api/farms', { method: 'POST', body: { name: 'পরিবারের হিসাব', type: 'family', budget: 0 } })
        .then(function (data) { state.farms.push(data.farm); openFarm(data.farm.id); })
        .catch(function (err) { addFamilyBtn.disabled = false; alert(translateErr(err.message)); });
    };
    wireNewFarmModal();
  }

  // ================= পাদদেশ — illustrated closing scene =================
  function renderFooterScene() {
    return '' +
      '<div class="footer-scene reveal">' +
      '<div class="footer-hill h1"></div><div class="footer-hill h2"></div>' +
      '<div class="footer-grass">' + grassSvg(30) + grassSvg(22) + grassSvg(34) + grassSvg(26) + grassSvg(30) + grassSvg(24) + '</div>' +
      '<div class="footer-cows">' + cowSvg({ size: 58, walking: false }) + cowSvg({ size: 44 }) + cowSvg({ size: 50, walking: false }) + '</div>' +
      '<p class="footer-line">' + t('footerLine') + ' 🌿</p>' +
      '<div class="cow-track"><div class="cow-mover" style="animation-duration:38s;">' + cowSvg({ size: 34 }) + '</div></div>' +
      '</div>';
  }

  var FARM_TYPE_LABELS = {
    cow: 'গরুর খামার', poultry: 'মুরগির খামার', goat: 'ছাগলের খামার',
    duck: 'হাঁসের খামার', fish: 'মাছের খামার', crop: 'কৃষি / ফসল', other: 'অন্যান্য খামার',
    family: 'পারিবারিক হিসাব',
  };
  var FAMILY_ICON = '🏠';
  // family-type farm/entry-এর icon সবসময় family emoji দেখাবে — কোনো পুরনো farm/cow ইমোজি নয়,
  // এমনকি যেসব family রেকর্ড আগে তৈরি হয়েছে সেগুলোর জন্যও (সংরক্ষিত ডাটা অপরিবর্তিত রেখেই)
  function farmDisplayIcon(farm) {
    return farm && farm.type === 'family' ? FAMILY_ICON : (farm ? farm.icon : '🏡');
  }
  function entryFarmIcon(entry) {
    return entry && entry.farmType === 'family' ? FAMILY_ICON : (entry ? entry.farmIcon : '🏡');
  }

  // ================= নতুন খামার — glass modal =================
  function renderNewFarmModal() {
    if (!state.newFarmModalOpen) return '';
    var types = state.farmTypes.length ? state.farmTypes : Object.keys(FARM_TYPE_LABELS).map(function (k) {
      return { key: k, label: FARM_TYPE_LABELS[k], icon: '🏡' };
    });
    var cards = types.map(function (ty) {
      return '<button class="type-card ' + (state.newFarm.type === ty.key ? 'sel' : '') + '" data-type="' + ty.key + '">' +
        '<span class="icon">' + esc(ty.icon) + '</span><span>' + esc(typeLabel(ty.label)) + '</span></button>';
    }).join('');

    var form = state.newFarm.type ? '' +
      '<div class="field" style="margin-top:16px;"><label for="nf-name">' + t('farmName') + '</label><input id="nf-name" type="text" placeholder="' + esc(t('farmNamePlaceholder')) + '" value="' + esc(state.newFarm.name) + '"></div>' +
      '<div class="field"><label for="nf-budget">' + t('startingBudget') + '</label><input id="nf-budget" type="number" min="0" placeholder="0" value="' + esc(state.newFarm.budget) + '"></div>' +
      '<div class="row"><button class="btn" id="nf-save">' + t('createFarm') + '</button><button class="btn secondary" id="nf-cancel">' + t('cancel') + '</button></div>' : '';

    return '' +
      '<div class="modal-backdrop" id="new-farm-backdrop">' +
      '<div class="modal">' +
      '<div class="card-head"><h2>' + t('addNewFarm') + '</h2><button class="icon-btn" id="nf-close" title="' + esc(t('cancel')) + '">✕</button></div>' +
      '<p style="color:var(--ink-dim);font-size:.9rem;margin:-8px 0 14px;">' + t('whatFarmType') + '</p>' +
      '<div class="type-grid">' + cards + '</div>' +
      form +
      '</div></div>';
  }

  function wireNewFarmModal() {
    var backdrop = document.getElementById('new-farm-backdrop');
    if (!backdrop) return;
    function close() { state.newFarmModalOpen = false; state.newFarm = { type: null, name: '', budget: '' }; render(); }
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    var closeBtn = document.getElementById('nf-close');
    if (closeBtn) closeBtn.onclick = close;
    document.querySelectorAll('.type-card').forEach(function (btn) {
      btn.onclick = function () { state.newFarm.type = btn.dataset.type; render(); };
    });
    var saveBtn = document.getElementById('nf-save');
    if (saveBtn) saveBtn.onclick = function () {
      var name = document.getElementById('nf-name').value.trim();
      var budget = document.getElementById('nf-budget').value;
      if (!name) { document.getElementById('nf-name').focus(); return; }
      api('/api/farms', { method: 'POST', body: { name: name, type: state.newFarm.type, budget: budget } })
        .then(function (data) {
          state.farms.push(data.farm);
          state.newFarmModalOpen = false;
          state.newFarm = { type: null, name: '', budget: '' };
          openFarm(data.farm.id);
        });
    };
    var cancelBtn = document.getElementById('nf-cancel');
    if (cancelBtn) cancelBtn.onclick = function () { state.newFarm = { type: null, name: '', budget: '' }; render(); };
  }

  // ================= ফার্ম ডিটেইল =================
  function currentYM() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function shiftYM(ym, delta) {
    var p = ym.split('-'); var d = new Date(Number(p[0]), Number(p[1]) - 1 + delta, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function ymLabel(ym) {
    var p = ym.split('-'); var d = new Date(Number(p[0]), Number(p[1]) - 1, 1);
    try { return new Intl.DateTimeFormat(state.lang === 'en' ? 'en-US' : 'bn-BD', { month: 'long', year: 'numeric' }).format(d); } catch (e) { return ym; }
  }

  function openFarm(id, push) {
    api('/api/farms/' + id).then(function (data) {
      state.currentFarm = data;
      state.view = 'farm';
      state.showEntryForm = false;
      state.editingEntryId = null;
      state.entryType = 'income';
      state.quickAddType = null;
      state.categoryBudgetModalOpen = false;
      state.activeQuickAction = null;
      state.familyMonth = currentYM(); // family খামার খুললে সবসময় চলতি মাস দিয়ে শুরু হয়
      if (push !== false) pushHash('#farm/' + id);
      render();
    });
  }

  function totalsFromEntries(entries) {
    var income = 0, expense = 0;
    entries.forEach(function (e) { if (e.type === 'income') income += Number(e.amount) || 0; else expense += Number(e.amount) || 0; });
    return { income: income, expense: expense, net: income - expense };
  }

  // ================= হিসাবের তালিকা — Excel/spreadsheet-স্টাইল টেবিল =================
  // Farm ও Family — দুই জায়গাতেই একই টেবিল কাঠামো ব্যবহৃত হয় (design consistency)।
  function entryTableHtml(entries, opts) {
    opts = opts || {};
    if (!entries || entries.length === 0) {
      return '<div class="empty-row">' + t('noRecordsYet') + '</div>';
    }
    var showDate = opts.showDate !== false;
    var showFarm = !!opts.showFarm;
    var showActions = !!opts.showActions;
    var compact = !!opts.compact; // শুধু তারিখ + পরিমাণ — বাড়তি কলাম ছাড়া পরিষ্কার/সংক্ষিপ্ত তালিকা
    var head = '<tr>' +
      (showDate ? '<th>' + t('tableDate') + '</th>' : '') +
      (showFarm ? '<th>' + t('tableFarmFamily') + '</th>' : '') +
      (compact ? '' : '<th>' + t('tableType') + '</th><th>' + t('tableCategory') + '</th><th>' + t('tableDesc') + '</th>') +
      '<th class="num-col">' + t('tableAmount') + '</th>' +
      (showActions ? '<th class="actions-col" aria-label="' + esc(t('edit')) + '"></th>' : '') +
      '</tr>';
    var rows = entries.map(function (e) {
      return '<tr class="' + (e.type === 'income' ? 'row-income' : 'row-expense') + '">' +
        (showDate ? '<td class="date-col">' + fmtDate(e.date) + '</td>' : '') +
        (showFarm ? '<td class="farm-col"><span class="table-farm"><span class="ic">' + esc(entryFarmIcon(e)) + '</span>' + esc(e.farmName) + '</span></td>' : '') +
        (compact ? '' :
          '<td><span class="pill ' + e.type + '">' + (e.type === 'income' ? t('income') : t('expense')) + '</span></td>' +
          '<td class="cat-col">' + esc(catLabel(e.category)) + '</td>' +
          '<td class="desc-col">' + (e.note ? esc(e.note) : '<span class="muted">—</span>') + '</td>') +
        '<td class="num-col num ' + e.type + '">' + (e.type === 'income' ? '+' : '-') + fmtMoney(e.amount) + '</td>' +
        (showActions ? '<td class="actions-col"><button class="icon-btn edit" data-id="' + e.id + '" title="' + esc(t('edit')) + '">✎</button><button class="icon-btn del" data-id="' + e.id + '" title="' + esc(t('delete')) + '">✕</button></td>' : '') +
        '</tr>';
    }).join('');
    return '<div class="table-wrap"><table class="data-table' + (compact ? ' data-table-compact' : '') + '"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  // ================= হিসাবের তালিকা — মাস অনুযায়ী আলাদা "শিট" =================
  // প্রতিটি মাসের হিসাব একটি স্বতন্ত্র, স্পষ্টভাবে লেবেল করা sheet-এ দেখায় (সবচেয়ে নতুন মাস আগে),
  // যাতে একাধিক মাসের এন্ট্রি কখনো একসাথে মিশে না যায় — পুরনো মাসগুলো সবসময় সংরক্ষিত ও দৃশ্যমান থাকে।
  function monthlySheetsHtml(entries) {
    if (!entries || entries.length === 0) return '<div class="empty-row">' + t('noRecordsYet') + '</div>';
    var byMonth = {};
    entries.forEach(function (e) {
      var k = monthKey(e.date);
      (byMonth[k] = byMonth[k] || []).push(e);
    });
    var months = Object.keys(byMonth).sort().reverse();
    return months.map(function (mk) {
      var list = byMonth[mk].slice().sort(function (a, b) { return b.date.localeCompare(a.date) || b.createdAt - a.createdAt; });
      return '<div class="month-sheet">' +
        '<div class="month-sheet-head">' +
        '<h3>🗓️ ' + esc(ymLabel(mk)) + '</h3>' +
        '</div>' +
        entryTableHtml(list, { showActions: true }) +
        '</div>';
    }).join('');
  }

  // "আজকের আয়/খরচ" quick-add-এর জন্য একটি যুক্তিসঙ্গত ডিফল্ট ক্যাটাগরি বেছে নেয়
  function defaultCategoryFor(cats, type) {
    var list = (cats && cats[type]) || [];
    if (!list.length) return 'অন্যান্য';
    var other = list.find(function (c) { return c.indexOf('অন্যান্য') !== -1; });
    return other || list[list.length - 1];
  }

  // ================= আজকের আয়/খরচ — কুইক অ্যাড =================
  function quickAddCardHtml(type) {
    if (!type) return '';
    var title = type === 'income' ? t('addTodaysIncome') : t('addTodaysExpense');
    return '' +
      '<div class="card quick-add-card" id="quick-add-card">' +
      '<div class="card-head"><h2>' + esc(title) + '</h2><button class="icon-btn" id="qa-add-close" title="' + esc(t('cancel')) + '">✕</button></div>' +
      '<div class="row">' +
      '<div class="field"><label for="qa-add-amount">' + t('amount') + '</label><input id="qa-add-amount" type="number" min="0" placeholder="0"></div>' +
      dateFieldHtml('qa-add-date', t('date'), todayISO()) +
      '</div>' +
      '<div class="field"><label for="qa-add-note">' + t('description') + '</label><input id="qa-add-note" type="text" placeholder="' + esc(t('optional')) + '"></div>' +
      '<div class="row" style="margin-top:6px;">' +
      '<button class="btn block-auto" id="qa-add-save">' + t('save') + '</button>' +
      '<button class="btn secondary block-auto" id="qa-add-cancel">' + t('cancel') + '</button>' +
      '</div>' +
      '</div>';
  }

  // ================= বাজেট — প্রতি ক্যাটাগরি ভিত্তিক =================
  function categoryBudgetModalHtml(cf) {
    if (!state.categoryBudgetModalOpen || !cf) return '';
    var farm = cf.farm, entries = cf.entries, cats = cf.categories || {};
    var expenseCats = cats.expense || [];
    var catBudgets = farm.categoryBudgets || {};
    var isEn = state.lang === 'en';

    var rows = expenseCats.map(function (cat) {
      var spent = entries.filter(function (e) { return e.type === 'expense' && e.category === cat; })
        .reduce(function (s, e) { return s + (Number(e.amount) || 0); }, 0);
      var catBudget = Number(catBudgets[cat]) || 0;
      var remaining = Math.max(catBudget - spent, 0);
      var exceeded = catBudget > 0 && spent > catBudget;
      var meta = t('spent') + ': <span class="num expense">' + fmtMoney(spent) + '</span>';
      if (catBudget > 0) meta += ' · ' + t('remainingBudget') + ': <span class="num ' + (exceeded ? 'expense' : 'income') + '">' + fmtMoney(remaining) + '</span>';
      if (exceeded) meta += ' · <span class="cat-budget-exceeded">' + t('budgetExceeded') + '</span>';
      return '' +
        '<div class="cat-budget-row">' +
        '<div class="cat-budget-name">' + esc(catLabel(cat)) + '</div>' +
        '<div class="cat-budget-input-wrap"><span class="cur">৳</span><input type="number" min="0" class="cat-budget-input" data-cat="' + esc(cat) + '" value="' + (catBudget || '') + '" placeholder="0"></div>' +
        '<div class="cat-budget-meta">' + meta + '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="modal-backdrop" id="cat-budget-backdrop">' +
      '<div class="modal">' +
      '<div class="card-head"><h2>' + t('budget') + '</h2><button class="icon-btn" id="cb-close" title="' + esc(t('cancel')) + '">✕</button></div>' +
      '<div class="my-budget-display"><div class="label">' + t('myBudget') + '</div><div class="value num">' + fmtMoney(farm.budget) + '</div></div>' +
      '<p style="color:var(--ink-dim);font-size:.85rem;margin:14px 0 10px;">' + (isEn ? 'Set a separate budget for each expense category — the remaining budget is calculated automatically as expenses are added.' : 'প্রতিটি খরচের ক্যাটাগরির জন্য আলাদা বাজেট সেট করুন — খরচ যোগ হলে অবশিষ্ট বাজেট স্বয়ংক্রিয়ভাবে হিসাব হবে।') + '</p>' +
      '<div class="cat-budget-list">' + (rows || '<p style="color:var(--ink-dim);font-size:.85rem;">' + (isEn ? 'No expense category for this farm.' : 'এই খামারের জন্য কোনো খরচ ক্যাটাগরি নেই।') + '</p>') + '</div>' +
      '<div class="row" style="margin-top:16px;">' +
      '<button class="btn block-auto" id="cb-save">' + t('save') + '</button>' +
      '<button class="btn secondary block-auto" id="cb-cancel">' + t('cancel') + '</button>' +
      '</div>' +
      '</div></div>';
  }

  function renderFarmDetail() {
    var cf = state.currentFarm;
    if (!cf) return '<div class="loading">' + t('loading') + '</div>';
    var farm = cf.farm, entries = cf.entries, cats = cf.categories;
    var isFamily = farm.type === 'family';
    if (isFamily && !state.familyMonth) state.familyMonth = currentYM();
    // Family-এর হিসাব মাসভিত্তিক — শুধু নির্বাচিত মাসের এন্ট্রি দিয়ে টোটাল/টেবিল/চার্ট হিসাব হয়;
    // পুরনো মাসের ডাটা মুছে যায় না, Monthly History থেকে যেকোনো মাস বেছে দেখা যায়
    var viewEntries = isFamily ? entries.filter(function (e) { return monthKey(e.date) === state.familyMonth; }) : entries;
    var tot = totalsFromEntries(viewEntries);

    var catOptions = (cats[state.entryType] || []).map(function (c) { return '<option value="' + esc(c) + '">' + esc(catLabel(c)) + '</option>'; }).join('');
    var editing = state.editingEntryId ? entries.find(function (e) { return e.id === state.editingEntryId; }) : null;

    var entryForm = '';
    if (state.showEntryForm || editing) {
      entryForm = '' +
        '<div class="type-toggle">' +
        '<button type="button" data-t="income" class="' + (state.entryType === 'income' ? 'active income' : '') + '">' + t('income') + '</button>' +
        '<button type="button" data-t="expense" class="' + (state.entryType === 'expense' ? 'active expense' : '') + '">' + t('expense') + '</button>' +
        '</div>' +
        '<div class="row">' +
        '<div class="field"><label for="ent-cat">' + t('category') + '</label><select id="ent-cat">' + catOptions + '</select></div>' +
        '<div class="field"><label for="ent-amount">' + t('amount') + '</label><input id="ent-amount" type="number" min="0" placeholder="0" value="' + (editing ? editing.amount : '') + '"></div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="field"><label for="ent-note">' + t('description') + '</label><input id="ent-note" type="text" placeholder="' + esc(t('optional')) + '" value="' + esc(editing ? editing.note : '') + '"></div>' +
        dateFieldHtml('ent-date', t('date'), editing ? editing.date : todayISO()) +
        '</div>' +
        '<div class="row" style="margin-top:6px;">' +
        '<button class="btn block-auto" id="ent-save">' + (editing ? t('updateRecord') : t('addRecord')) + '</button>' +
        '<button class="btn secondary block-auto" id="ent-cancel">' + t('cancel') + '</button>' +
        '</div>';
    }

    // হিসাবের তালিকা — প্রতিটি মাস আলাদা "শিট" হিসেবে দেখানো হয় (Farm ও Family দুটোতেই),
    // যাতে একই তালিকায় বিভিন্ন মাসের হিসাব মিশে না যায়; পুরনো মাসের এন্ট্রি সবসময় সংরক্ষিত ও দৃশ্যমান থাকে
    var entryRowsHtml = monthlySheetsHtml(entries);

    // বাজেট হিসাব
    var budget = Number(farm.budget) || 0;
    var used = tot.expense;
    var remaining = Math.max(budget - used, 0);
    var exceeded = used > budget;
    var overspend = exceeded ? used - budget : 0;
    var pct = budget > 0 ? Math.round((used / budget) * 100) : (used > 0 ? 100 : 0);

    var editFarmModal = state.editFarmOpen ? '' +
      '<div class="modal-backdrop" id="farm-edit-backdrop">' +
      '<div class="modal">' +
      '<h2>' + t('editFarmInfo') + '</h2>' +
      '<div class="field"><label for="ef-name">' + t('name') + '</label><input id="ef-name" type="text" value="' + esc(farm.name) + '"></div>' +
      '<div class="field"><label for="ef-budget">' + t('budget') + ' (৳)</label><input id="ef-budget" type="number" min="0" value="' + farm.budget + '"></div>' +
      '<div class="row"><button class="btn" id="ef-save">' + t('save') + '</button><button class="btn secondary" id="ef-cancel">' + t('cancel') + '</button></div>' +
      '</div></div>' : '';

    var entryFormCard = (state.showEntryForm || editing)
      ? '<div class="card" id="entry-form-card"><div class="card-head"><h2>' + (editing ? (state.lang === 'en' ? 'Edit Record' : 'হিসাব এডিট করুন') : (state.lang === 'en' ? 'Add New Record' : 'নতুন হিসাব যোগ করুন')) + '</h2></div>' + entryForm + '</div>'
      : '';

    var totalsHeading = isFamily ? t('familyRecords') : t('farmRecords');
    var farmHeadDesc = isFamily ? (state.lang === 'en'
      ? 'Manage your family’s current income, expenses, and activity in one place.'
      : 'আপনার পরিবারের বর্তমান আয়-ব্যয় ও কার্যক্রম এক জায়গায় পরিচালনা করুন।')
      : (state.lang === 'en'
      ? 'Manage your farm’s current records and activity in one place.'
      : 'আপনার খামারের বর্তমান হিসাব ও কার্যক্রম এক জায়গায় পরিচালনা করুন।');

    // পরিবারের জন্য মাসিক history/calendar নেভিগেটর — আগের যেকোনো মাসের হিসাব ব্রাউজ করা যায়,
    // চলতি মাস ছাড়া বাকি সব মাস read-only ভাবে দেখা যায় (পুরনো এন্ট্রি কখনো মোছা হয় না)
    var monthNavHtml = '';
    if (isFamily) {
      var allMonths = {};
      entries.forEach(function (e) { allMonths[monthKey(e.date)] = true; });
      allMonths[currentYM()] = true;
      var monthList = Object.keys(allMonths).sort().reverse();
      var monthOptions = monthList.map(function (ym) {
        return '<option value="' + ym + '"' + (ym === state.familyMonth ? ' selected' : '') + '>' + esc(ymLabel(ym)) + '</option>';
      }).join('');
      var isCurrentMonth = state.familyMonth === currentYM();
      monthNavHtml = '<div class="month-nav">' +
        '<span class="month-nav-title">📅 ' + t('monthlyHistory') + '</span>' +
        '<div class="month-nav-controls">' +
        '<button type="button" class="month-nav-btn" id="fm-prev" aria-label="' + esc(t('prevMonth')) + '">‹</button>' +
        '<select id="fm-select" class="month-nav-select" aria-label="' + esc(t('selectMonth')) + '">' + monthOptions + '</select>' +
        '<button type="button" class="month-nav-btn" id="fm-next" aria-label="' + esc(t('nextMonth')) + '" ' + (isCurrentMonth ? 'disabled' : '') + '>›</button>' +
        '</div>' +
        (isCurrentMonth ? '<span class="month-nav-badge">' + t('thisMonthLabel') + '</span>' : '') +
        '</div>';
    }

    return '' +
      '<div class="farm-head">' +
      '<span class="icon-badge">' + esc(farmDisplayIcon(farm)) + '</span>' +
      '<div><h1>' + esc(farm.name) + '</h1><div class="type-label">' + farmHeadDesc + '</div></div>' +
      '</div>' +
      monthNavHtml +

      '<div class="section-title"><h2>' + totalsHeading + (isFamily ? ' — ' + ymLabel(state.familyMonth) : '') + '</h2>' + (exceeded ? '<span class="budget-exceeded-badge">' + t('budgetExceeded') + '</span>' : '') + '</div>' +
      '<div class="totals-grid" id="budget-card">' +
      '<div class="total-box"><span class="total-ic">💰</span><div class="label">' + t('myBudget') + '</div><div class="value num">' + fmtMoney(budget) + '</div></div>' +
      '<div class="total-box expense"><span class="total-ic">🧾</span><div class="label">' + t('spent') + '</div><div class="value num">' + fmtMoney(used) + '</div></div>' +
      '<div class="total-box ' + (exceeded ? 'expense' : 'income') + '"><span class="total-ic">🎯</span><div class="label">' + t('remainingBudget') + '</div><div class="value num">' + fmtMoney(remaining) + '</div></div>' +
      '<div class="total-box income" id="stat-income"><span class="total-ic">📈</span><div class="label">' + t('totalIncome') + '</div><div class="value num">' + fmtMoney(tot.income) + '</div></div>' +
      '<div class="total-box expense" id="stat-expense"><span class="total-ic">📉</span><div class="label">' + t('totalExpense') + '</div><div class="value num">' + fmtMoney(tot.expense) + '</div></div>' +
      '<div class="total-box ' + (tot.net >= 0 ? 'income' : 'expense') + '" id="stat-net"><span class="total-ic">⚖️</span><div class="label">' + t('profitLoss') + '</div><div class="value num">' + (tot.net >= 0 ? '' : '-') + fmtMoney(Math.abs(tot.net)) + '</div></div>' +
      '</div>' +
      '<div class="budget-progress-track"><div class="budget-progress-fill' + (exceeded ? ' over' : '') + '" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
      '<div class="budget-progress-label">' + pct + t('percentSpent') + '</div>' +
      (exceeded ? '<div class="budget-exceeded-note">' + t('overspend') + ': ' + fmtMoney(overspend) + '</div>' : '') +

      '<div class="section-title"><h2>' + t('quickActions') + '</h2></div>' +
      '<div class="quick-grid">' +
      '<button class="quick-card' + (state.activeQuickAction === 'new-entry' ? ' active' : '') + '" id="qa-new-entry"><span class="ic">➕</span><span class="lbl">' + t('newRecord') + '</span></button>' +
      '<button class="quick-card' + (state.activeQuickAction === 'today-income' ? ' active' : '') + '" id="qa-today-income"><span class="ic">🌞</span><span class="lbl">' + t('todaysIncome') + '</span></button>' +
      '<button class="quick-card' + (state.activeQuickAction === 'today-expense' ? ' active' : '') + '" id="qa-today-expense"><span class="ic">🛒</span><span class="lbl">' + t('todaysExpense') + '</span></button>' +
      '<button class="quick-card' + (state.activeQuickAction === 'budget' ? ' active' : '') + '" id="qa-budget"><span class="ic">🎯</span><span class="lbl">' + t('budget') + '</span></button>' +
      '<button class="quick-card' + (state.activeQuickAction === 'list' ? ' active' : '') + '" id="qa-list"><span class="ic">📋</span><span class="lbl">' + t('recordsList') + '</span></button>' +
      '</div>' +
      quickAddCardHtml(state.quickAddType) +
      entryFormCard +
      categoryBudgetModalHtml(cf) +
      '<div class="card">' +
      '<div class="card-head"><h2>' + t('monthlyIncomeVsExpense') + '</h2></div>' +
      chartSvg(entries) +
      '</div>' +
      '<div class="card">' +
      '<div class="card-head"><h2>' + t('profitLossTrend') + '</h2></div>' +
      trendSvg(entries) +
      '</div>' +
      '<div class="card">' +
      '<div class="card-head-col"><h2>' + t('categoryBreakdown') + '</h2><p class="card-subtitle">' + t('categoryBreakdownDesc') + '</p></div>' +
      categoryDonutHtml(viewEntries) +
      '</div>' +
      '<div class="card" id="entry-list-card">' +
      entryRowsHtml +
      '</div>' +
      '<div class="farm-bottom-actions">' +
      '<button class="btn secondary small" id="btn-edit-farm">✎ ' + t('edit') + '</button>' +
      '<button class="btn danger small" id="btn-del-farm">' + t('delete') + '</button>' +
      '</div>' +
      editFarmModal;
  }

  function chartSvg(list) {
    var byMonth = {};
    (list || []).forEach(function (e) {
      var k = monthKey(e.date);
      if (!k) return;
      if (!byMonth[k]) byMonth[k] = { income: 0, expense: 0 };
      byMonth[k][e.type] += Number(e.amount) || 0;
    });
    var keys = Object.keys(byMonth).sort().slice(-6);
    if (keys.length === 0) return '<div class="empty-row">' + t('noChartData') + '</div>';
    var max = 1;
    keys.forEach(function (k) { max = Math.max(max, byMonth[k].income, byMonth[k].expense); });
    var w = 600, h = 210, padL = 50, padB = 28, padT = 10, padR = 10;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var groupW = plotW / keys.length;
    var barW = Math.min(24, groupW / 2 - 6);
    var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + w + 'px" role="img" aria-label="' + esc(t('monthlyIncomeVsExpense')) + '">';
    [0, 0.5, 1].forEach(function (f) {
      var y = padT + plotH * (1 - f);
      svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (w - padR) + '" y2="' + y + '" stroke="var(--border)" stroke-width="1"/>';
      svg += '<text x="' + (padL - 8) + '" y="' + (y + 3) + '" text-anchor="end">' + fmtMoney(Math.round(max * f)) + '</text>';
    });
    keys.forEach(function (k, i) {
      var cx = padL + groupW * i + groupW / 2;
      var vi = byMonth[k].income, ve = byMonth[k].expense;
      var hi = plotH * (vi / max), he = plotH * (ve / max);
      svg += '<rect x="' + (cx - barW - 3) + '" y="' + (padT + plotH - hi) + '" width="' + barW + '" height="' + hi + '" rx="3" fill="var(--income)"/>';
      svg += '<rect x="' + (cx + 3) + '" y="' + (padT + plotH - he) + '" width="' + barW + '" height="' + he + '" rx="3" fill="var(--expense)"/>';
      svg += '<text x="' + cx + '" y="' + (h - 8) + '" text-anchor="middle">' + monthLabel(k) + '</text>';
    });
    svg += '</svg>';
    svg += '<div class="chart-legend"><span><span class="dot" style="background:var(--income);"></span>' + t('income') + '</span><span><span class="dot" style="background:var(--expense);"></span>' + t('expense') + '</span></div>';
    return svg;
  }

  function trendSvg(list) {
    var byMonth = {};
    (list || []).forEach(function (e) {
      var k = monthKey(e.date);
      if (!k) return;
      if (!byMonth[k]) byMonth[k] = { income: 0, expense: 0 };
      byMonth[k][e.type] += Number(e.amount) || 0;
    });
    var keys = Object.keys(byMonth).sort().slice(-6);
    if (keys.length === 0) return '<div class="empty-row">' + t('noTrendData') + '</div>';
    var nets = keys.map(function (k) { return byMonth[k].income - byMonth[k].expense; });
    var maxAbs = Math.max(1, Math.max.apply(null, nets.map(Math.abs)));
    var w = 600, h = 210, padL = 50, padB = 28, padT = 14, padR = 14;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var midY = padT + plotH / 2;
    var stepX = keys.length > 1 ? plotW / (keys.length - 1) : 0;
    var pts = nets.map(function (n, i) {
      var x = padL + stepX * i;
      var y = midY - (n / maxAbs) * (plotH / 2);
      return { x: x, y: y };
    });
    var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + w + 'px" role="img" aria-label="' + esc(t('profitLossTrend')) + '">';
    svg += '<line x1="' + padL + '" y1="' + midY + '" x2="' + (w - padR) + '" y2="' + midY + '" stroke="var(--border)" stroke-width="1"/>';
    var path = pts.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y; }).join(' ');
    svg += '<path d="' + path + '" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    pts.forEach(function (p, i) {
      var col = nets[i] >= 0 ? 'var(--income)' : 'var(--expense)';
      svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="4.5" fill="' + col + '" stroke="var(--surface)" stroke-width="1.5"/>';
      svg += '<text x="' + p.x + '" y="' + (h - 8) + '" text-anchor="middle">' + monthLabel(keys[i]) + '</text>';
    });
    svg += '</svg>';
    return svg;
  }

  // সব category-এর percentage যোগ করলে ঠিক 100% হয় (largest-remainder rounding) —
  // স্বাধীনভাবে প্রতিটা রাউন্ড করলে মাঝেমধ্যে যোগফল 99%/101% হয়ে যেত, সেটা এড়াতে
  function percentagesSumTo100(amounts, total) {
    var raw = amounts.map(function (a) { return (a / total) * 100; });
    var floors = raw.map(Math.floor);
    var used = floors.reduce(function (s, v) { return s + v; }, 0);
    var remainder = 100 - used;
    var order = raw.map(function (v, i) { return { i: i, frac: v - floors[i] }; }).sort(function (a, b) { return b.frac - a.frac; });
    for (var k = 0; k < remainder; k++) floors[order[k % order.length].i] += 1;
    return floors;
  }

  function categoryDonutHtml(list) {
    var byCat = {};
    (list || []).forEach(function (e) {
      if (e.type !== 'expense') return;
      var amt = Number(e.amount) || 0;
      if (amt <= 0) return; // শূন্য/অবৈধ পরিমাণ chart-এ দেখানো হবে না
      byCat[e.category] = (byCat[e.category] || 0) + amt;
    });
    var rows = Object.keys(byCat).map(function (c) { return { cat: c, amt: byCat[c] }; }).sort(function (a, b) { return b.amt - a.amt; });
    if (rows.length === 0) return '<div class="empty-row">' + t('noCategoryData') + '</div>';
    var total = rows.reduce(function (s, r) { return s + r.amt; }, 0) || 1;
    var pcts = percentagesSumTo100(rows.map(function (r) { return r.amt; }), total);
    var palette = ['#c65a3a', '#d98a2b', '#2f8f5b', '#4fb37d', '#b0793f', '#8f6a3a', '#9c6b3f', '#e6a850'];
    var r = 54, cx = 64, cy = 64, circumf = 2 * Math.PI * r;
    var offset = 0;
    var segs = rows.map(function (row, i) {
      var frac = row.amt / total;
      var len = frac * circumf;
      var seg = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + palette[i % palette.length] + '" ' +
        'stroke-width="20" stroke-dasharray="' + len + ' ' + (circumf - len) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += len;
      return seg;
    }).join('');
    var svg = '<svg viewBox="0 0 128 128" width="150" height="150" role="img" aria-label="' + esc(t('categoryBreakdown')) + '">' + segs +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 22) + '" fill="var(--surface)"/>' +
      '</svg>';
    var rows2 = rows.map(function (row, i) {
      var color = palette[i % palette.length];
      return '<div class="cat-row">' +
        '<div class="cat-row-top">' +
        '<span class="cat-row-name"><span class="dot" style="background:' + color + '"></span>' + esc(catLabel(row.cat)) + '</span>' +
        '<span class="cat-row-amt num">' + fmtMoney(row.amt) + '</span>' +
        '</div>' +
        '<div class="cat-row-bar-track"><div class="cat-row-bar-fill" style="width:' + pcts[i] + '%;background:' + color + '"></div></div>' +
        '<div class="cat-row-pct">' + pcts[i] + '% ' + t('categoryOfTotal') + '</div>' +
        '</div>';
    }).join('');
    var singleNote = rows.length === 1
      ? '<div class="donut-single-note"><strong>' + esc(catLabel(rows[0].cat)) + '</strong> — ' + t('singleCategoryNote') + '</div>' : '';
    return '<div class="donut-wrap"><div class="donut-ring-wrap">' + svg + singleNote + '</div><div class="cat-rows">' + rows2 + '</div></div>';
  }

  function wireFarmDetail() {
    var farmId = state.currentFarm.farm.id;

    function scrollTo(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    var fmPrev = document.getElementById('fm-prev');
    if (fmPrev) fmPrev.onclick = function () { state.familyMonth = shiftYM(state.familyMonth, -1); render(); };
    var fmNext = document.getElementById('fm-next');
    if (fmNext) fmNext.onclick = function () {
      var next = shiftYM(state.familyMonth, 1);
      if (next > currentYM()) return; // ভবিষ্যতের মাসে যাওয়া যাবে না
      state.familyMonth = next; render();
    };
    var fmSelect = document.getElementById('fm-select');
    if (fmSelect) fmSelect.onchange = function () { state.familyMonth = fmSelect.value; render(); };
    var qaNew = document.getElementById('qa-new-entry');
    if (qaNew) qaNew.onclick = function () {
      state.showEntryForm = true; state.entryType = 'income'; state.quickAddType = null; state.activeQuickAction = 'new-entry'; render();
      var el = document.getElementById('ent-cat'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    var qaBudget = document.getElementById('qa-budget');
    if (qaBudget) qaBudget.onclick = function () { state.categoryBudgetModalOpen = true; state.activeQuickAction = 'budget'; render(); };
    var qaList = document.getElementById('qa-list');
    if (qaList) qaList.onclick = function () { state.activeQuickAction = 'list'; render(); scrollTo('entry-list-card'); };

    var qaTodayIncome = document.getElementById('qa-today-income');
    if (qaTodayIncome) qaTodayIncome.onclick = function () {
      state.quickAddType = 'income'; state.showEntryForm = false; state.editingEntryId = null; state.activeQuickAction = 'today-income'; render();
      var el = document.getElementById('quick-add-card'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    var qaTodayExpense = document.getElementById('qa-today-expense');
    if (qaTodayExpense) qaTodayExpense.onclick = function () {
      state.quickAddType = 'expense'; state.showEntryForm = false; state.editingEntryId = null; state.activeQuickAction = 'today-expense'; render();
      var el = document.getElementById('quick-add-card'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    var qaAddClose = document.getElementById('qa-add-close');
    if (qaAddClose) qaAddClose.onclick = function () { state.quickAddType = null; state.activeQuickAction = null; render(); };
    var qaAddCancel = document.getElementById('qa-add-cancel');
    if (qaAddCancel) qaAddCancel.onclick = function () { state.quickAddType = null; state.activeQuickAction = null; render(); };
    var qaAddSave = document.getElementById('qa-add-save');
    if (qaAddSave) qaAddSave.onclick = function () {
      var amount = document.getElementById('qa-add-amount').value;
      var date = document.getElementById('qa-add-date').value || todayISO();
      var note = document.getElementById('qa-add-note').value;
      var category = defaultCategoryFor(state.currentFarm.categories, state.quickAddType);
      api('/api/farms/' + farmId + '/entries', { method: 'POST', body: { type: state.quickAddType, category: category, amount: amount, date: date, note: note } })
        .then(function () { state.quickAddType = null; state.activeQuickAction = null; return openFarm(farmId); })
        .catch(function (err) { alert(translateErr(err.message)); });
    };

    var cbBackdrop = document.getElementById('cat-budget-backdrop');
    if (cbBackdrop) {
      cbBackdrop.addEventListener('click', function (e) { if (e.target === cbBackdrop) { state.categoryBudgetModalOpen = false; state.activeQuickAction = null; render(); } });
      var cbClose = document.getElementById('cb-close');
      if (cbClose) cbClose.onclick = function () { state.categoryBudgetModalOpen = false; state.activeQuickAction = null; render(); };
      var cbCancel = document.getElementById('cb-cancel');
      if (cbCancel) cbCancel.onclick = function () { state.categoryBudgetModalOpen = false; state.activeQuickAction = null; render(); };
      var cbSave = document.getElementById('cb-save');
      if (cbSave) cbSave.onclick = function () {
        var map = {};
        document.querySelectorAll('.cat-budget-input').forEach(function (inp) { map[inp.dataset.cat] = inp.value || 0; });
        api('/api/farms/' + farmId, { method: 'PATCH', body: { categoryBudgets: map } })
          .then(function () { state.categoryBudgetModalOpen = false; state.activeQuickAction = null; return openFarm(farmId); })
          .catch(function (err) { alert(translateErr(err.message)); });
      };
    }

    document.querySelectorAll('.type-toggle [data-t]').forEach(function (b) {
      b.onclick = function () { state.entryType = b.dataset.t; render(); };
    });

    var saveBtn = document.getElementById('ent-save');
    if (saveBtn) saveBtn.onclick = function () {
      var payload = {
        type: state.entryType,
        category: document.getElementById('ent-cat').value,
        amount: document.getElementById('ent-amount').value,
        date: document.getElementById('ent-date').value || todayISO(),
        note: document.getElementById('ent-note').value,
      };
      var req = state.editingEntryId
        ? api('/api/entries/' + state.editingEntryId, { method: 'PATCH', body: payload })
        : api('/api/farms/' + farmId + '/entries', { method: 'POST', body: payload });
      req.then(function () {
        state.showEntryForm = false; state.editingEntryId = null;
        return openFarm(farmId);
      }).catch(function (err) { alert(translateErr(err.message)); });
    };
    var cancelBtn = document.getElementById('ent-cancel');
    if (cancelBtn) cancelBtn.onclick = function () { state.showEntryForm = false; state.editingEntryId = null; state.activeQuickAction = null; render(); };

    document.querySelectorAll('.icon-btn.edit').forEach(function (b) {
      b.onclick = function () {
        var e = state.currentFarm.entries.find(function (x) { return x.id === b.dataset.id; });
        if (!e) return;
        state.editingEntryId = e.id; state.entryType = e.type; state.showEntryForm = false; state.quickAddType = null; state.activeQuickAction = null;
        render();
      };
    });
    document.querySelectorAll('.icon-btn.del').forEach(function (b) {
      b.onclick = function () {
        if (!confirm(t('deleteRecordConfirm'))) return;
        api('/api/entries/' + b.dataset.id, { method: 'DELETE' }).then(function () { openFarm(farmId); });
      };
    });

    var editFarmBtn = document.getElementById('btn-edit-farm');
    if (editFarmBtn) editFarmBtn.onclick = function () { state.editFarmOpen = true; render(); };
    var delFarmBtn = document.getElementById('btn-del-farm');
    if (delFarmBtn) delFarmBtn.onclick = function () {
      if (!confirm('"' + state.currentFarm.farm.name + '" ' + t('deleteFarmConfirm'))) return;
      api('/api/farms/' + farmId, { method: 'DELETE' }).then(function () { goDashboard(); });
    };
    var backdrop = document.getElementById('farm-edit-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', function (e) { if (e.target === backdrop) { state.editFarmOpen = false; render(); } });
      document.getElementById('ef-cancel').onclick = function () { state.editFarmOpen = false; render(); };
      document.getElementById('ef-save').onclick = function () {
        var name = document.getElementById('ef-name').value.trim();
        var budget = document.getElementById('ef-budget').value;
        if (!name) return;
        api('/api/farms/' + farmId, { method: 'PATCH', body: { name: name, budget: budget } }).then(function () {
          state.editFarmOpen = false;
          openFarm(farmId);
        });
      };
    }
  }

  // ================= রিপোর্ট =================
  function reportRangeFor(filter, custom) {
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    function pad(n) { return String(n).padStart(2, '0'); }
    function iso(dt) { return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()); }
    if (filter === 'all') {
      return { from: '0000-01-01', to: '9999-12-31' };
    }
    if (filter === 'last-month') {
      var lm = new Date(y, m - 1, 1);
      return { from: iso(lm), to: iso(new Date(y, m, 0)) };
    }
    if (filter === 'this-year') {
      return { from: y + '-01-01', to: y + '-12-31' };
    }
    if (filter === 'custom') {
      return { from: custom.from || '0000-01-01', to: custom.to || '9999-12-31' };
    }
    return { from: iso(new Date(y, m, 1)), to: iso(new Date(y, m + 1, 0)) };
  }

  function renderReports() {
    if (state.farms.length === 0) {
      return '<div class="empty-state"><div class="icon">📊</div><h2 style="font-size:1.2rem;">' + t('noFarmsForReports') + '</h2><p>' + t('noFarmsForReportsDesc') + '</p></div>';
    }
    var range = reportRangeFor(state.reportFilter, state.reportCustom);
    var filtered = (state.reportEntries || []).filter(function (e) { return e.date >= range.from && e.date <= range.to; });
    var mi = 0, me = 0;
    filtered.forEach(function (e) { if (e.type === 'income') mi += Number(e.amount) || 0; else me += Number(e.amount) || 0; });
    var mNet = mi - me;

    var totalIncome = 0, totalExpense = 0;
    state.farms.forEach(function (f) { totalIncome += f.totals.income; totalExpense += f.totals.expense; });
    var net = totalIncome - totalExpense;
    var max = Math.max(1, Math.max.apply(null, state.farms.map(function (f) { return Math.max(f.totals.income, f.totals.expense); })));

    var bars = state.farms.map(function (f) {
      var wi = Math.round((f.totals.income / max) * 100);
      var we = Math.round((f.totals.expense / max) * 100);
      return '<div style="margin-bottom:16px;">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>' + esc(farmDisplayIcon(f)) + ' ' + esc(f.name) + '</span><span class="num" style="color:var(--ink-dim);font-size:.85rem;">' + t('profitLoss') + ' ' + fmtMoney(f.totals.net) + '</span></div>' +
        '<div style="background:var(--surface-2);border-radius:8px;height:10px;overflow:hidden;margin-bottom:4px;"><div style="width:' + wi + '%;height:100%;background:var(--income);"></div></div>' +
        '<div style="background:var(--surface-2);border-radius:8px;height:10px;overflow:hidden;"><div style="width:' + we + '%;height:100%;background:var(--expense);"></div></div>' +
        '</div>';
    }).join('');

    var filters = [
      { key: 'this-month', label: t('thisMonth') },
      { key: 'last-month', label: t('lastMonth') },
      { key: 'this-year', label: t('thisYear') },
      { key: 'custom', label: t('customRange') },
    ];
    var pills = filters.map(function (f) {
      return '<button class="filter-pill ' + (state.reportFilter === f.key ? 'active' : '') + '" data-filter="' + f.key + '">' + f.label + '</button>';
    }).join('') + (state.reportFilter === 'custom'
      ? '<span class="filter-pill custom-inputs">' + dateInputBtnCompactHtml('rf-from', state.reportCustom.from || todayISO()) + ' – ' + dateInputBtnCompactHtml('rf-to', state.reportCustom.to || todayISO()) + '</span>'
      : '');

    return '' +
      '<h1 style="font-size:1.5rem;margin-bottom:6px;">' + t('reportsHeading') + '</h1>' +
      '<p style="color:var(--ink-dim);margin-bottom:16px;">' + t('reportsDesc') + '</p>' +
      '<div class="filter-pills">' + pills + '</div>' +
      '<div class="stat-grid stat-grid-3">' +
      '<div class="stat income"><div class="label">' + t('monthlyIncome') + '</div><div class="value num">' + fmtMoney(mi) + '</div></div>' +
      '<div class="stat expense"><div class="label">' + t('monthlyExpense') + '</div><div class="value num">' + fmtMoney(me) + '</div></div>' +
      '<div class="stat net"><div class="label">' + t('monthlyProfitLoss') + '</div><div class="value num ' + (mNet >= 0 ? 'pos' : 'neg') + '">' + (mNet >= 0 ? '' : '-') + fmtMoney(Math.abs(mNet)) + '</div></div>' +
      '</div>' +
      '<div class="card"><div class="card-head-col"><h2>' + t('categoryWiseExpense') + '</h2><p class="card-subtitle">' + t('categoryBreakdownDesc') + '</p></div>' + categoryDonutHtml(filtered) + '</div>' +
      '<div class="card"><div class="card-head"><h2>' + t('incomeVsExpensePeriod') + '</h2></div>' + chartSvg(filtered) + '</div>' +
      '<div class="card"><div class="card-head"><h2>' + t('overallComparison') + '</h2></div>' +
      '<div class="chart-legend" style="margin-bottom:14px;"><span><span class="dot" style="background:var(--income);"></span>' + t('income') + '</span><span><span class="dot" style="background:var(--expense);"></span>' + t('expense') + '</span></div>' +
      bars +
      '<div style="display:flex;justify-content:space-between;margin-top:6px;padding-top:14px;border-top:1px solid var(--border);font-weight:700;">' +
      '<span>' + t('overallTotal') + '</span><span class="num ' + (net >= 0 ? 'income' : 'expense') + '">' + fmtMoney(totalIncome) + ' − ' + fmtMoney(totalExpense) + ' = ' + fmtMoney(Math.abs(net)) + ' ' + (net >= 0 ? t('profit') : t('loss')) + '</span>' +
      '</div></div>';
  }

  function wireReports() {
    document.querySelectorAll('.filter-pill[data-filter]').forEach(function (btn) {
      btn.onclick = function () { state.reportFilter = btn.dataset.filter; render(); };
    });
    var fromEl = document.getElementById('rf-from');
    var toEl = document.getElementById('rf-to');
    if (fromEl) fromEl.onchange = function () { state.reportCustom.from = fromEl.value; render(); };
    if (toEl) toEl.onchange = function () { state.reportCustom.to = toEl.value; render(); };
  }

  // ================= হিস্টোরি — day-by-day সব হিসাব =================
  function renderHistory() {
    var filters = [
      { key: 'this-month', label: t('thisMonth') },
      { key: 'last-month', label: t('lastMonth') },
      { key: 'this-year', label: t('thisYear') },
      { key: 'all', label: t('allTime') },
      { key: 'custom', label: t('customRange') },
    ];
    var pills = filters.map(function (f) {
      return '<button class="filter-pill ' + (state.historyFilter === f.key ? 'active' : '') + '" data-hfilter="' + f.key + '">' + f.label + '</button>';
    }).join('') + (state.historyFilter === 'custom'
      ? '<span class="filter-pill custom-inputs">' + dateInputBtnCompactHtml('hf-from', state.historyCustom.from || todayISO()) + ' – ' + dateInputBtnCompactHtml('hf-to', state.historyCustom.to || todayISO()) + '</span>'
      : '');

    var range = reportRangeFor(state.historyFilter, state.historyCustom);
    var filtered = (state.reportEntries || []).filter(function (e) { return e.date >= range.from && e.date <= range.to; });

    var byDate = {};
    filtered.forEach(function (e) { (byDate[e.date] = byDate[e.date] || []).push(e); });
    var dates = Object.keys(byDate).sort().reverse();

    var body;
    if (dates.length === 0) {
      body = '<div class="empty-state"><div class="icon">🗓️</div><h2 style="font-size:1.2rem;">' + t('noRecordsThisPeriod') + '</h2><p>' + t('tryDifferentPeriod') + '</p></div>';
    } else {
      body = dates.map(function (d) {
        var list = byDate[d].slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
        var dayIncome = 0, dayExpense = 0;
        list.forEach(function (e) { if (e.type === 'income') dayIncome += Number(e.amount) || 0; else dayExpense += Number(e.amount) || 0; });
        var rows = entryTableHtml(list, { showDate: false, showFarm: true, showActions: false });
        return '<div class="history-day">' +
          '<div class="history-day-head"><h3>' + fmtDate(d) + '</h3>' +
          '<div class="history-day-sum"><span class="num income">+' + fmtMoney(dayIncome) + '</span><span class="num expense">-' + fmtMoney(dayExpense) + '</span></div></div>' +
          rows +
          '</div>';
      }).join('');
    }

    return '' +
      '<h1 style="font-size:1.5rem;margin-bottom:6px;">' + t('historyHeading') + '</h1>' +
      '<p style="color:var(--ink-dim);margin-bottom:16px;">' + t('historyDesc') + '</p>' +
      '<div class="filter-pills">' + pills + '</div>' +
      body;
  }

  function wireHistory() {
    document.querySelectorAll('.filter-pill[data-hfilter]').forEach(function (btn) {
      btn.onclick = function () { state.historyFilter = btn.dataset.hfilter; render(); };
    });
    var fromEl = document.getElementById('hf-from');
    var toEl = document.getElementById('hf-to');
    if (fromEl) fromEl.onchange = function () { state.historyCustom.from = fromEl.value; render(); };
    if (toEl) toEl.onchange = function () { state.historyCustom.to = toEl.value; render(); };
  }

  // ================= অ্যাপ ডাউনলোড =================
  function renderDownloadApp() {
    var steps = [t('downloadAppStep1'), t('downloadAppStep2'), t('downloadAppStep3'), t('downloadAppStep4')];
    return '' +
      '<h1 style="font-size:1.5rem;margin-bottom:16px;">' + t('downloadAppHeading') + '</h1>' +
      '<div class="card" style="max-width:520px;">' +
      '<div style="font-size:3rem;text-align:center;margin-bottom:6px;">📱</div>' +
      '<p style="color:var(--ink-dim);font-size:.95rem;line-height:1.7;text-align:center;margin-bottom:18px;">' + esc(t('downloadAppDesc')) + '</p>' +
      '<a class="btn primary block-auto" id="download-apk-link" href="/downloads/BakaraManagement.apk" download="BakaraManagement.apk" style="text-align:center;display:block;text-decoration:none;">⬇ ' + t('downloadAppBtn') + '</a>' +
      '</div>' +
      '<div class="card" style="max-width:520px;">' +
      '<div class="card-head"><h2>' + t('downloadAppSteps') + '</h2></div>' +
      '<ol style="margin:0;padding-inline-start:22px;color:var(--ink-dim);font-size:.9rem;line-height:2;">' +
      steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
      '</ol>' +
      '</div>' +
      '<p style="color:var(--ink-dim);font-size:.85rem;line-height:1.6;max-width:520px;">ℹ️ ' + esc(t('downloadAppNote')) + '</p>';
  }

  // ================= সেটিংস =================
  function renderSettings() {
    return '' +
      '<h1 style="font-size:1.5rem;margin-bottom:16px;">' + t('settingsHeading') + '</h1>' +
      '<div class="card" style="max-width:440px;">' +
      '<div class="card-head"><h2>' + t('language') + '</h2></div>' +
      '<p style="color:var(--ink-dim);font-size:.9rem;line-height:1.6;margin-bottom:14px;">' + t('languageDesc') + '</p>' +
      '<div class="lang-switch">' +
      '<button class="lang-opt' + (state.lang === 'bn' ? ' active' : '') + '" id="lang-bn" type="button">বাংলা</button>' +
      '<button class="lang-opt' + (state.lang === 'en' ? ' active' : '') + '" id="lang-en" type="button">English</button>' +
      '</div>' +
      '</div>' +
      '<div class="card" style="max-width:440px;">' +
      '<div class="card-head"><h2>' + t('profile') + '</h2></div>' +
      '<div class="field"><label>' + t('name') + '</label><input value="' + esc(state.user.name) + '" disabled></div>' +
      '<div class="field"><label>' + t('email') + '</label><input value="' + esc(state.user.email) + '" disabled></div>' +
      '<div class="row" style="margin-bottom:10px;">' +
      '<button class="btn secondary block-auto" id="btn-edit-profile">✎ ' + t('editProfile') + '</button>' +
      '<button class="btn danger block-auto" id="settings-logout">' + t('logoutButton') + '</button>' +
      '</div>' +
      '</div>' +
      '<div class="card" style="max-width:440px;">' +
      '<div class="card-head"><h2>' + t('monthlyReportEmail') + '</h2></div>' +
      '<p style="color:var(--ink-dim);font-size:.9rem;line-height:1.6;margin-bottom:14px;">' + t('monthlyReportDesc') + '</p>' +
      (state.reportMailStatus ? '<div class="form-notice">' + esc(state.reportMailStatus) + '</div>' : '') +
      '<button class="btn secondary block-auto" id="btn-send-test-report" ' + (state.reportMailBusy ? 'disabled' : '') + '>' + (state.reportMailBusy ? t('sending') : t('sendTestReport')) + '</button>' +
      '</div>' +
      renderEditProfileModal();
  }

  var AVATAR_COLORS = ['#a9683c', '#2e5b3e', '#3a6ea6', '#a63a5c', '#6a4fa6', '#a6862f'];
  function renderEditProfileModal() {
    if (!state.editProfileOpen) return '';
    var pf = state.profileFields;
    var swatches = AVATAR_COLORS.map(function (c) {
      return '<button type="button" class="avatar-swatch' + (pf.avatarColor === c ? ' sel' : '') + '" data-color="' + c + '" style="background:' + c + '"></button>';
    }).join('');
    return '' +
      '<div class="modal-backdrop" id="edit-profile-backdrop">' +
      '<div class="modal">' +
      '<div class="card-head"><h2>' + t('editProfile') + '</h2><button class="icon-btn" id="ep-close" title="' + esc(t('cancel')) + '">✕</button></div>' +
      '<div class="field"><label for="ep-name">' + t('name') + '</label><input id="ep-name" type="text" value="' + esc(pf.name) + '"></div>' +
      '<div class="field"><label>' + t('avatarColor') + '</label><div class="avatar-swatches">' + swatches + '</div></div>' +
      '<div class="row"><button class="btn block-auto" id="ep-save" ' + (state.profileBusy ? 'disabled' : '') + '>' + (state.profileBusy ? t('sending') : t('saveProfile')) + '</button><button class="btn secondary block-auto" id="ep-cancel">' + t('cancel') + '</button></div>' +
      '</div></div>';
  }

  function wireSettings() {
    var langBn = document.getElementById('lang-bn');
    if (langBn) langBn.onclick = function () { setLang('bn'); };
    var langEn = document.getElementById('lang-en');
    if (langEn) langEn.onclick = function () { setLang('en'); };

    var editProfileBtn = document.getElementById('btn-edit-profile');
    if (editProfileBtn) editProfileBtn.onclick = function () {
      state.editProfileOpen = true;
      state.profileFields = { name: state.user.name, avatarColor: state.user.avatarColor || AVATAR_COLORS[0] };
      render();
    };
    var epBackdrop = document.getElementById('edit-profile-backdrop');
    if (epBackdrop) {
      function closeEp() { state.editProfileOpen = false; render(); }
      epBackdrop.addEventListener('click', function (e) { if (e.target === epBackdrop) closeEp(); });
      document.getElementById('ep-close').onclick = closeEp;
      document.getElementById('ep-cancel').onclick = closeEp;
      var epNameInput = document.getElementById('ep-name');
      if (epNameInput) epNameInput.oninput = function () { state.profileFields.name = epNameInput.value; };
      document.querySelectorAll('.avatar-swatch').forEach(function (sw) {
        // রং বদলালে re-render হয় — তাই টাইপ করা নাম হারিয়ে না যাওয়ার জন্য আগে state-এ সংরক্ষণ করে নেওয়া হচ্ছে
        sw.onclick = function () {
          if (epNameInput) state.profileFields.name = epNameInput.value;
          state.profileFields.avatarColor = sw.dataset.color;
          render();
        };
      });
      document.getElementById('ep-save').onclick = function () {
        var name = document.getElementById('ep-name').value.trim();
        if (!name) return;
        state.profileBusy = true; render();
        api('/api/auth/me', { method: 'PATCH', body: { name: name, avatarColor: state.profileFields.avatarColor } })
          .then(function (data) {
            state.user = data.user;
            state.profileBusy = false;
            state.editProfileOpen = false;
            render();
          })
          .catch(function (err) { state.profileBusy = false; alert(translateErr(err.message)); render(); });
      };
    }

    var btn = document.getElementById('btn-send-test-report');
    if (btn) btn.onclick = function () {
      state.reportMailBusy = true; state.reportMailStatus = ''; render();
      api('/api/reports/send-monthly', { method: 'POST', body: {} })
        .then(function (data) {
          state.reportMailBusy = false;
          var isEn = state.lang === 'en';
          state.reportMailStatus = data.dryRun
            ? (data.monthLabel + (isEn ? ' report generated, but SMTP is not configured — so it will only appear in the server log, not sent by email.' : ' মাসের রিপোর্ট তৈরি হয়েছে, কিন্তু SMTP কনফিগার করা নেই — তাই সার্ভার লগে দেখা যাবে, ইমেইলে যায়নি।'))
            : (data.monthLabel + (isEn ? ' report sent to ' : ' মাসের রিপোর্ট ') + esc(state.user.email) + (isEn ? ' — if you don’t see it, please check your Spam/Junk folder.' : ' ঠিকানায় পাঠানো হয়েছে — ইনবক্সে না পেলে Spam/Junk ফোল্ডার চেক করুন।'));
          render();
        })
        .catch(function (err) { state.reportMailBusy = false; state.reportMailStatus = (state.lang === 'en' ? 'Something went wrong: ' : 'সমস্যা হয়েছে: ') + translateErr(err.message); render(); });
    };
  }

  // ================= data loaders =================
  function loadFarms() {
    return api('/api/farms').then(function (data) { state.farms = data.farms; });
  }
  function loadRecentActivity() {
    return api('/api/farms/activity/recent').then(function (data) { state.recentActivity = data.recent; });
  }
  function loadFarmTypes() {
    return api('/api/farms/types').then(function (data) { state.farmTypes = data.types; }).catch(function () {});
  }
  function loadReportEntries() {
    return api('/api/farms/report/entries').then(function (data) { state.reportEntries = data.entries; });
  }

  // attach settings logout after render (delegate via wireApp -> but settings view not wired above); handle here:
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'settings-logout') doLogout();
  });

  // পাসওয়ার্ড দেখা/লুকানো — delegated listener, যেকোনো auth স্ক্রিনে নতুন করে render হলেও কাজ করে
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.pw-toggle') : null;
    if (!btn) return;
    var input = document.getElementById(btn.dataset.for);
    if (!input) return;
    var showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.innerHTML = showing ? EYE_OPEN_SVG : EYE_OFF_SVG;
    btn.title = showing ? t('showPassword') : t('hidePassword');
    btn.setAttribute('aria-label', btn.title);
  });

  // ================= init =================
  function setLang(lang) {
    state.lang = (lang === 'en') ? 'en' : 'bn';
    saveLang(state.lang);
    if (document.documentElement) document.documentElement.setAttribute('lang', state.lang);
    render();
  }

  // ---------------- অ্যাপ খোলার সময় একবার — গরুর greeting splash animation ----------------
  // পুরো আসল UI-এর উপরে একটা ওভারলে হিসেবে দেখায়, নিচে render() স্বাভাবিকভাবেই চলতে থাকে,
  // তাই এটা কোনো real loading delay তৈরি করে না — শুধু প্রথম ১.৬ সেকেন্ডের একটা প্রফেশনাল greeting।
  function showSplash() {
    if (reducedMotion) return; // motion কম চাওয়া ব্যবহারকারীর জন্য splash দেখানো হবে না
    // পোর্টফোলিও প্রিভিউ-only: আসল লাইভ অ্যাপে এটা sessionStorage দিয়ে ট্যাব-প্রতি একবারই দেখানো হয়
    // (বারবার reload-এ বিরক্তিকর না হওয়ার জন্য) — কিন্তু এই ডেমো প্রিভিউতে প্রতিবার খোলার সময়ই এই
    // greeting animation-টা দেখানো ভালো, তাই এখানে সেই once-per-tab গেটটা বাদ দেওয়া হলো।
    var el = document.createElement('div');
    el.className = 'app-splash';
    el.innerHTML = '<div class="app-splash-cow">' + cowWaveSvg(96) + '</div>';
    document.body.appendChild(el);
    setTimeout(function () {
      el.classList.add('fade-out');
      setTimeout(function () { el.remove(); }, 450);
    }, 1500);
  }

  function init() {
    showSplash();
    state.lang = loadLang();
    if (document.documentElement) document.documentElement.setAttribute('lang', state.lang);
    var params = new URLSearchParams(window.location.search);
    var tokenFromUrl = params.get('resetToken');
    if (tokenFromUrl) {
      state.resetToken = tokenFromUrl;
      state.authMode = 'reset';
    }
    // সেশন যাচাই — app/website রিলোড বা পুনরায় খোলার সময় আগের লগইন টিকে থাকে (৯০ দিনের rolling session,
    // server.js দেখুন); ব্যবহারকারী নিজে Logout না করা পর্যন্ত, বা সেশন সত্যিই মেয়াদোত্তীর্ণ না হলে, আবার
    // লগইন করতে হয় না। এখানে কখনো জোর করে logout কল করা হয় না — করলে Google OAuth ফ্লো ভেঙে যেত,
    // কারণ Google login সফল হওয়ার পর সার্ভার '/'-এ পূর্ণ পেজ redirect করে, আর init() আবার শুরু থেকে চলে;
    // তখন এখানে logout call থাকলে সেটা তৎক্ষণাৎ সদ্য তৈরি হওয়া সেশনটাই মুছে দিত, ফলে Dashboard-এর বদলে
    // আবার Login স্ক্রিন দেখাত — এটাই ছিল "Google login-এর পর আবার লগইন স্ক্রিনে ফিরে যাওয়া" বাগের আসল কারণ।
    api('/api/auth/me').then(function (data) {
      state.googleEnabled = !!data.googleEnabled;
      if (data.user && !tokenFromUrl) {
        state.user = data.user;
        Promise.all([loadFarms(), loadRecentActivity(), loadFarmTypes()]).then(render);
      } else {
        render();
      }
    }).catch(function () { render(); });
  }

  init();
})();
