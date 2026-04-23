// ============================================
// FARM AI BUILDER — Complete Agricultural Data
// ============================================

const SEASONS = {
  kharif: { name: "Kharif", period: "June – October", icon: "🌧️", color: "#10b981" },
  rabi: { name: "Rabi", period: "November – April", icon: "❄️", color: "#3b82f6" },
  zaid: { name: "Zaid", period: "March – June", icon: "☀️", color: "#f59e0b" }
};

const CROP_CATEGORIES = {
  food: { name: "Food Crops", icon: "🌾", color: "#10b981" },
  cash: { name: "Cash Crops", icon: "💰", color: "#f59e0b" },
  plantation: { name: "Plantation Crops", icon: "🌴", color: "#8b5cf6" },
  horticulture: { name: "Horticulture", icon: "🍎", color: "#ef4444" }
};

const STATES_DATA = {
  "Andhra Pradesh": {
    region: "South", capital: "Amaravati",
    climate: "Tropical & semi-arid; hot summers, moderate rainfall",
    avgTemp: "27°C", rainfall: "940 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Groundnut", "Red Gram", "Maize"],
      rabi: ["Bengal Gram", "Jowar", "Sunflower", "Black Gram"],
      zaid: ["Watermelon", "Cucumber", "Vegetables"]
    },
    crops: { food: ["Rice", "Jowar", "Maize"], cash: ["Cotton", "Tobacco", "Chilli"], plantation: ["Coconut", "Oil Palm"], horticulture: ["Mango", "Banana", "Citrus"] },
    mandis: [
      { name: "Guntur Mandi", location: "Guntur", speciality: "Chilli, Cotton" },
      { name: "Kurnool Mandi", location: "Kurnool", speciality: "Groundnut, Jowar" },
      { name: "Vijayawada Mandi", location: "Vijayawada", speciality: "Rice, Vegetables" }
    ]
  },
  "Arunachal Pradesh": {
    region: "East", capital: "Itanagar",
    climate: "Alpine to subtropical; cool, heavy rainfall",
    avgTemp: "19°C", rainfall: "2782 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Millet"],
      rabi: ["Wheat", "Mustard", "Potato"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize", "Millet"], cash: ["Ginger", "Cardamom"], plantation: ["Tea"], horticulture: ["Kiwi", "Orange", "Apple", "Walnut"] },
    mandis: [
      { name: "Itanagar Market", location: "Itanagar", speciality: "Organic Produce, Kiwi" }
    ]
  },
  "Assam": {
    region: "East", capital: "Dispur",
    climate: "Subtropical monsoon; heavy rainfall, humid",
    avgTemp: "24°C", rainfall: "2818 mm",
    seasons: {
      kharif: ["Rice", "Jute", "Sugarcane", "Maize"],
      rabi: ["Wheat", "Mustard", "Potato", "Pulses"],
      zaid: ["Vegetables", "Fruits"]
    },
    crops: { food: ["Rice", "Wheat", "Maize"], cash: ["Tea", "Jute", "Sugarcane"], plantation: ["Tea", "Rubber"], horticulture: ["Orange", "Banana", "Pineapple"] },
    mandis: [
      { name: "Guwahati Mandi", location: "Guwahati", speciality: "Tea, Rice" },
      { name: "Jorhat Mandi", location: "Jorhat", speciality: "Tea, Jute" }
    ]
  },
  "Bihar": {
    region: "East", capital: "Patna",
    climate: "Subtropical; extreme summers, good monsoon rainfall",
    avgTemp: "26°C", rainfall: "1200 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Jute", "Sugarcane"],
      rabi: ["Wheat", "Barley", "Gram", "Lentil", "Mustard"],
      zaid: ["Moong", "Vegetables", "Watermelon"]
    },
    crops: { food: ["Rice", "Wheat", "Maize", "Lentil"], cash: ["Sugarcane", "Jute", "Tobacco"], plantation: ["Litchi Orchards"], horticulture: ["Litchi", "Mango", "Banana", "Guava"] },
    mandis: [
      { name: "Patna Mandi", location: "Patna", speciality: "Wheat, Rice" },
      { name: "Muzaffarpur Mandi", location: "Muzaffarpur", speciality: "Litchi, Banana" },
      { name: "Gaya Mandi", location: "Gaya", speciality: "Pulses, Oilseeds" }
    ]
  },
  "Chhattisgarh": {
    region: "Central", capital: "Raipur",
    climate: "Tropical; hot & humid, moderate to heavy rainfall",
    avgTemp: "27°C", rainfall: "1400 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Soybean", "Arhar"],
      rabi: ["Wheat", "Gram", "Linseed", "Mustard"],
      zaid: ["Vegetables", "Moong"]
    },
    crops: { food: ["Rice", "Wheat", "Maize"], cash: ["Soybean", "Sugarcane"], plantation: ["Sal", "Teak"], horticulture: ["Tomato", "Brinjal", "Mango"] },
    mandis: [
      { name: "Raipur Mandi", location: "Raipur", speciality: "Rice, Pulses" },
      { name: "Durg Mandi", location: "Durg", speciality: "Soybean, Wheat" }
    ]
  },
  "Goa": {
    region: "West", capital: "Panaji",
    climate: "Tropical monsoon; warm & humid, heavy monsoon rainfall",
    avgTemp: "27°C", rainfall: "2932 mm",
    seasons: {
      kharif: ["Rice", "Ragi", "Sugarcane"],
      rabi: ["Pulses", "Groundnut", "Vegetables"],
      zaid: ["Watermelon", "Cucumber"]
    },
    crops: { food: ["Rice", "Ragi"], cash: ["Cashew", "Coconut"], plantation: ["Coconut", "Arecanut", "Cashew"], horticulture: ["Mango", "Pineapple", "Banana", "Jackfruit"] },
    mandis: [
      { name: "Panaji Market", location: "Panaji", speciality: "Cashew, Coconut" }
    ]
  },
  "Gujarat": {
    region: "West", capital: "Gandhinagar",
    climate: "Arid to semi-arid; hot summers, moderate monsoon",
    avgTemp: "28°C", rainfall: "800 mm",
    seasons: {
      kharif: ["Cotton", "Groundnut", "Rice", "Bajra", "Castor"],
      rabi: ["Wheat", "Mustard", "Cumin", "Gram"],
      zaid: ["Moong", "Watermelon", "Vegetables"]
    },
    crops: { food: ["Wheat", "Rice", "Bajra"], cash: ["Cotton", "Groundnut", "Castor", "Tobacco"], plantation: ["Coconut", "Date Palm"], horticulture: ["Mango", "Banana", "Sapota", "Pomegranate"] },
    mandis: [
      { name: "Rajkot Mandi", location: "Rajkot", speciality: "Groundnut, Cotton" },
      { name: "Ahmedabad APMC", location: "Ahmedabad", speciality: "Vegetables, Spices" },
      { name: "Unjha Mandi", location: "Unjha", speciality: "Cumin, Fennel" },
      { name: "Gondal Mandi", location: "Gondal", speciality: "Groundnut, Onion" }
    ]
  },
  "Haryana": {
    region: "North", capital: "Chandigarh",
    climate: "Semi-arid continental; extreme summers & winters",
    avgTemp: "25°C", rainfall: "450 mm",
    seasons: {
      kharif: ["Rice", "Bajra", "Cotton", "Sugarcane", "Maize"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard"],
      zaid: ["Moong", "Vegetables", "Fodder"]
    },
    crops: { food: ["Wheat", "Rice", "Bajra", "Barley"], cash: ["Cotton", "Sugarcane", "Mustard"], plantation: [], horticulture: ["Citrus", "Guava", "Mango"] },
    mandis: [
      { name: "Karnal Mandi", location: "Karnal", speciality: "Rice, Wheat" },
      { name: "Hisar Mandi", location: "Hisar", speciality: "Cotton, Mustard" },
      { name: "Sirsa Mandi", location: "Sirsa", speciality: "Cotton, Guar" }
    ]
  },
  "Himachal Pradesh": {
    region: "North", capital: "Shimla",
    climate: "Temperate to alpine; cool summers, cold winters, good snowfall",
    avgTemp: "18°C", rainfall: "1500 mm",
    seasons: {
      kharif: ["Maize", "Rice", "Millet"],
      rabi: ["Wheat", "Barley", "Gram"],
      zaid: ["Vegetables", "Fruits"]
    },
    crops: { food: ["Wheat", "Maize", "Rice", "Barley"], cash: ["Saffron"], plantation: ["Tea"], horticulture: ["Apple", "Cherry", "Plum", "Peach", "Walnut", "Kiwi"] },
    mandis: [
      { name: "Shimla APMC", location: "Shimla", speciality: "Apple, Stone Fruits" },
      { name: "Kullu Mandi", location: "Kullu", speciality: "Apple, Plum" }
    ]
  },
  "Jharkhand": {
    region: "East", capital: "Ranchi",
    climate: "Subtropical; hot summers, moderate monsoon",
    avgTemp: "25°C", rainfall: "1400 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Arhar", "Urad"],
      rabi: ["Wheat", "Gram", "Mustard", "Linseed"],
      zaid: ["Vegetables", "Moong"]
    },
    crops: { food: ["Rice", "Wheat", "Maize"], cash: ["Lac", "Tasar Silk"], plantation: ["Sal"], horticulture: ["Mango", "Litchi", "Guava", "Jackfruit"] },
    mandis: [
      { name: "Ranchi Mandi", location: "Ranchi", speciality: "Rice, Vegetables" },
      { name: "Dumka Mandi", location: "Dumka", speciality: "Rice, Pulses" }
    ]
  },
  "Karnataka": {
    region: "South", capital: "Bengaluru",
    climate: "Tropical to semi-arid; varied across coastal & plateau",
    avgTemp: "26°C", rainfall: "1248 mm",
    seasons: {
      kharif: ["Rice", "Jowar", "Maize", "Ragi", "Cotton"],
      rabi: ["Wheat", "Gram", "Safflower", "Sunflower"],
      zaid: ["Vegetables", "Watermelon"]
    },
    crops: { food: ["Rice", "Ragi", "Jowar", "Maize"], cash: ["Coffee", "Sugarcane", "Cotton"], plantation: ["Coffee", "Cardamom", "Arecanut", "Coconut"], horticulture: ["Mango", "Grapes", "Banana", "Pomegranate"] },
    mandis: [
      { name: "Bengaluru APMC", location: "Bengaluru", speciality: "Vegetables, Flowers" },
      { name: "Hubli-Dharwad Mandi", location: "Hubli", speciality: "Cotton, Groundnut" },
      { name: "Mysuru Mandi", location: "Mysuru", speciality: "Coffee, Spices" }
    ]
  },
  "Kerala": {
    region: "South", capital: "Thiruvananthapuram",
    climate: "Tropical maritime; warm, very humid, heavy monsoon",
    avgTemp: "27°C", rainfall: "3000 mm",
    seasons: {
      kharif: ["Rice", "Tapioca", "Ginger"],
      rabi: ["Rice (second crop)", "Vegetables"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Tapioca"], cash: ["Rubber", "Pepper", "Cardamom"], plantation: ["Coconut", "Rubber", "Tea", "Coffee", "Pepper", "Cardamom"], horticulture: ["Banana", "Pineapple", "Jackfruit", "Mango"] },
    mandis: [
      { name: "Kochi Market", location: "Kochi", speciality: "Spices, Rubber" },
      { name: "Thrissur Mandi", location: "Thrissur", speciality: "Coconut, Rice" }
    ]
  },
  "Madhya Pradesh": {
    region: "Central", capital: "Bhopal",
    climate: "Subtropical; hot summers, good monsoon, mild winters",
    avgTemp: "26°C", rainfall: "1160 mm",
    seasons: {
      kharif: ["Soybean", "Rice", "Maize", "Jowar", "Cotton"],
      rabi: ["Wheat", "Gram", "Lentil", "Mustard"],
      zaid: ["Moong", "Vegetables", "Watermelon"]
    },
    crops: { food: ["Wheat", "Rice", "Gram", "Maize"], cash: ["Soybean", "Cotton", "Sugarcane"], plantation: ["Teak", "Sal"], horticulture: ["Mango", "Guava", "Orange", "Banana"] },
    mandis: [
      { name: "Indore Mandi", location: "Indore", speciality: "Soybean, Wheat" },
      { name: "Bhopal APMC", location: "Bhopal", speciality: "Wheat, Gram" },
      { name: "Neemuch Mandi", location: "Neemuch", speciality: "Garlic, Coriander" },
      { name: "Mandsaur Mandi", location: "Mandsaur", speciality: "Garlic, Opium" }
    ]
  },
  "Maharashtra": {
    region: "West", capital: "Mumbai",
    climate: "Tropical monsoon to semi-arid; variable rainfall",
    avgTemp: "27°C", rainfall: "1200 mm",
    seasons: {
      kharif: ["Rice", "Jowar", "Bajra", "Cotton", "Soybean", "Sugarcane"],
      rabi: ["Wheat", "Gram", "Safflower", "Sunflower"],
      zaid: ["Vegetables", "Watermelon"]
    },
    crops: { food: ["Rice", "Wheat", "Jowar", "Bajra"], cash: ["Sugarcane", "Cotton", "Soybean"], plantation: ["Coconut", "Cashew"], horticulture: ["Mango", "Grapes", "Pomegranate", "Orange", "Onion", "Banana"] },
    mandis: [
      { name: "Vashi APMC", location: "Navi Mumbai", speciality: "Vegetables, Fruits" },
      { name: "Lasalgaon Mandi", location: "Nashik", speciality: "Onion" },
      { name: "Pune APMC", location: "Pune", speciality: "Vegetables, Grains" },
      { name: "Nagpur Mandi", location: "Nagpur", speciality: "Orange, Cotton" }
    ]
  },
  "Manipur": {
    region: "East", capital: "Imphal",
    climate: "Subtropical highland; cool, moderate rainfall",
    avgTemp: "21°C", rainfall: "1467 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Soybean"],
      rabi: ["Mustard", "Peas", "Potato"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize"], cash: ["Sugarcane"], plantation: [], horticulture: ["Pineapple", "Passion Fruit", "Orange", "Banana"] },
    mandis: [
      { name: "Imphal Market", location: "Imphal", speciality: "Rice, Vegetables" }
    ]
  },
  "Meghalaya": {
    region: "East", capital: "Shillong",
    climate: "Subtropical highland; very heavy rainfall (Cherrapunji)",
    avgTemp: "20°C", rainfall: "2818 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Ginger", "Turmeric"],
      rabi: ["Potato", "Vegetables", "Mustard"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize"], cash: ["Ginger", "Turmeric"], plantation: ["Arecanut"], horticulture: ["Orange", "Pineapple", "Strawberry", "Jackfruit"] },
    mandis: [
      { name: "Shillong Market", location: "Shillong", speciality: "Ginger, Turmeric" }
    ]
  },
  "Mizoram": {
    region: "East", capital: "Aizawl",
    climate: "Tropical to subtropical; warm, heavy monsoon rainfall",
    avgTemp: "22°C", rainfall: "2500 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Ginger"],
      rabi: ["Mustard", "Peas", "Vegetables"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize"], cash: ["Ginger", "Turmeric"], plantation: ["Oil Palm"], horticulture: ["Banana", "Orange", "Passion Fruit", "Grape"] },
    mandis: [
      { name: "Aizawl Market", location: "Aizawl", speciality: "Ginger, Vegetables" }
    ]
  },
  "Nagaland": {
    region: "East", capital: "Kohima",
    climate: "Subtropical highland; mild, moderate to heavy rainfall",
    avgTemp: "21°C", rainfall: "1800 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Millet"],
      rabi: ["Mustard", "Potato", "Pulses"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize", "Millet"], cash: ["Sugarcane"], plantation: ["Tea"], horticulture: ["Orange", "Pineapple", "Passion Fruit", "Kiwi"] },
    mandis: [
      { name: "Dimapur Market", location: "Dimapur", speciality: "Rice, Vegetables" }
    ]
  },
  "Odisha": {
    region: "East", capital: "Bhubaneswar",
    climate: "Tropical; hot & humid, heavy monsoon, cyclone-prone",
    avgTemp: "27°C", rainfall: "1500 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Groundnut", "Sugarcane"],
      rabi: ["Wheat", "Gram", "Mustard", "Linseed"],
      zaid: ["Moong", "Vegetables"]
    },
    crops: { food: ["Rice", "Wheat", "Ragi"], cash: ["Sugarcane", "Jute", "Cotton"], plantation: ["Coconut", "Cashew"], horticulture: ["Mango", "Banana", "Litchi", "Guava"] },
    mandis: [
      { name: "Cuttack Mandi", location: "Cuttack", speciality: "Rice, Vegetables" },
      { name: "Sambalpur Mandi", location: "Sambalpur", speciality: "Rice, Oilseeds" }
    ]
  },
  "Punjab": {
    region: "North", capital: "Chandigarh",
    climate: "Semi-arid continental; extreme temperatures, moderate rain",
    avgTemp: "24°C", rainfall: "600 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Maize", "Sugarcane", "Bajra"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard"],
      zaid: ["Moong", "Vegetables", "Fodder"]
    },
    crops: { food: ["Wheat", "Rice", "Maize", "Barley"], cash: ["Cotton", "Sugarcane"], plantation: [], horticulture: ["Kinnow", "Guava", "Pear", "Peach"] },
    mandis: [
      { name: "Khanna Mandi", location: "Khanna", speciality: "Wheat, Rice" },
      { name: "Amritsar Mandi", location: "Amritsar", speciality: "Wheat, Vegetables" },
      { name: "Ludhiana APMC", location: "Ludhiana", speciality: "Rice, Cotton" },
      { name: "Bathinda Mandi", location: "Bathinda", speciality: "Cotton, Mustard" }
    ]
  },
  "Rajasthan": {
    region: "North", capital: "Jaipur",
    climate: "Arid to semi-arid; very hot summers, scanty rainfall",
    avgTemp: "26°C", rainfall: "530 mm",
    seasons: {
      kharif: ["Bajra", "Jowar", "Maize", "Groundnut", "Guar"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard", "Cumin"],
      zaid: ["Moong", "Watermelon", "Vegetables"]
    },
    crops: { food: ["Wheat", "Bajra", "Barley", "Maize"], cash: ["Mustard", "Guar", "Cumin"], plantation: ["Date Palm"], horticulture: ["Mango", "Ber", "Pomegranate", "Kinnow"] },
    mandis: [
      { name: "Jaipur Mandi", location: "Jaipur", speciality: "Mustard, Gram" },
      { name: "Jodhpur Mandi", location: "Jodhpur", speciality: "Bajra, Guar" },
      { name: "Kota Mandi", location: "Kota", speciality: "Soybean, Coriander" }
    ]
  },
  "Sikkim": {
    region: "East", capital: "Gangtok",
    climate: "Subtropical to alpine; cool, heavy rainfall",
    avgTemp: "18°C", rainfall: "2739 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Cardamom"],
      rabi: ["Wheat", "Barley", "Potato"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize", "Wheat"], cash: ["Cardamom", "Ginger"], plantation: ["Cardamom", "Tea"], horticulture: ["Orange", "Apple", "Pear", "Guava"] },
    mandis: [
      { name: "Gangtok Market", location: "Gangtok", speciality: "Cardamom, Organic Produce" }
    ]
  },
  "Tamil Nadu": {
    region: "South", capital: "Chennai",
    climate: "Tropical; hot & humid, northeast monsoon dominant",
    avgTemp: "29°C", rainfall: "945 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Sugarcane", "Groundnut"],
      rabi: ["Rice (Samba)", "Pulses", "Millets"],
      zaid: ["Vegetables", "Flowers"]
    },
    crops: { food: ["Rice", "Ragi", "Bajra", "Maize"], cash: ["Sugarcane", "Cotton", "Groundnut"], plantation: ["Tea", "Coffee", "Coconut", "Rubber"], horticulture: ["Banana", "Mango", "Coconut", "Jackfruit"] },
    mandis: [
      { name: "Koyambedu Market", location: "Chennai", speciality: "Vegetables, Fruits, Flowers" },
      { name: "Coimbatore APMC", location: "Coimbatore", speciality: "Cotton, Coconut" },
      { name: "Madurai Mandi", location: "Madurai", speciality: "Banana, Rice" }
    ]
  },
  "Telangana": {
    region: "South", capital: "Hyderabad",
    climate: "Semi-arid tropical; hot & dry, moderate monsoon",
    avgTemp: "27°C", rainfall: "900 mm",
    seasons: {
      kharif: ["Rice", "Cotton", "Maize", "Red Gram", "Soybean"],
      rabi: ["Rice", "Gram", "Groundnut", "Sunflower"],
      zaid: ["Vegetables", "Muskmelon"]
    },
    crops: { food: ["Rice", "Maize", "Jowar"], cash: ["Cotton", "Sugarcane", "Turmeric"], plantation: ["Oil Palm"], horticulture: ["Mango", "Orange", "Guava", "Papaya"] },
    mandis: [
      { name: "Hyderabad APMC", location: "Hyderabad", speciality: "Vegetables, Fruits" },
      { name: "Warangal Mandi", location: "Warangal", speciality: "Cotton, Rice" },
      { name: "Nizamabad Mandi", location: "Nizamabad", speciality: "Turmeric, Rice" }
    ]
  },
  "Tripura": {
    region: "East", capital: "Agartala",
    climate: "Tropical monsoon; warm, very heavy rainfall",
    avgTemp: "25°C", rainfall: "2100 mm",
    seasons: {
      kharif: ["Rice", "Jute", "Maize"],
      rabi: ["Potato", "Mustard", "Vegetables"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Maize"], cash: ["Jute", "Rubber"], plantation: ["Rubber", "Tea"], horticulture: ["Pineapple", "Orange", "Jackfruit", "Banana"] },
    mandis: [
      { name: "Agartala Market", location: "Agartala", speciality: "Rice, Rubber" }
    ]
  },
  "Uttar Pradesh": {
    region: "North", capital: "Lucknow",
    climate: "Subtropical; extreme summers & winters, good monsoon",
    avgTemp: "26°C", rainfall: "990 mm",
    seasons: {
      kharif: ["Rice", "Sugarcane", "Maize", "Bajra", "Jowar"],
      rabi: ["Wheat", "Barley", "Gram", "Mustard", "Peas"],
      zaid: ["Moong", "Watermelon", "Cucumber", "Vegetables"]
    },
    crops: { food: ["Wheat", "Rice", "Barley", "Maize", "Millets"], cash: ["Sugarcane", "Potato", "Mustard"], plantation: [], horticulture: ["Mango", "Guava", "Banana", "Aonla", "Potato"] },
    mandis: [
      { name: "Lucknow Mandi", location: "Lucknow", speciality: "Wheat, Rice" },
      { name: "Agra Mandi", location: "Agra", speciality: "Potato, Wheat" },
      { name: "Kanpur APMC", location: "Kanpur", speciality: "Grains, Pulses" },
      { name: "Varanasi Mandi", location: "Varanasi", speciality: "Vegetables, Grains" },
      { name: "Meerut Mandi", location: "Meerut", speciality: "Sugarcane, Wheat" }
    ]
  },
  "Uttarakhand": {
    region: "North", capital: "Dehradun",
    climate: "Temperate to alpine; cool summers, cold winters",
    avgTemp: "20°C", rainfall: "1550 mm",
    seasons: {
      kharif: ["Rice", "Maize", "Mandua", "Jhangora"],
      rabi: ["Wheat", "Barley", "Mustard", "Lentil"],
      zaid: ["Vegetables"]
    },
    crops: { food: ["Rice", "Wheat", "Mandua", "Barley"], cash: ["Sugarcane"], plantation: ["Tea"], horticulture: ["Apple", "Peach", "Litchi", "Mango", "Walnut"] },
    mandis: [
      { name: "Dehradun Mandi", location: "Dehradun", speciality: "Basmati Rice, Fruits" },
      { name: "Haridwar APMC", location: "Haridwar", speciality: "Grains, Vegetables" }
    ]
  },
  "West Bengal": {
    region: "East", capital: "Kolkata",
    climate: "Tropical wet; hot & humid, heavy monsoon",
    avgTemp: "27°C", rainfall: "1750 mm",
    seasons: {
      kharif: ["Rice (Aman)", "Jute", "Maize", "Sugarcane"],
      rabi: ["Wheat", "Mustard", "Potato", "Gram"],
      zaid: ["Aus Rice", "Vegetables", "Jute"]
    },
    crops: { food: ["Rice", "Wheat", "Maize"], cash: ["Jute", "Tea", "Potato"], plantation: ["Tea", "Rubber"], horticulture: ["Mango", "Litchi", "Banana", "Pineapple", "Guava"] },
    mandis: [
      { name: "Kolkata APMC", location: "Kolkata", speciality: "Rice, Jute, Vegetables" },
      { name: "Siliguri Mandi", location: "Siliguri", speciality: "Tea, Rice" },
      { name: "Burdwan Mandi", location: "Burdwan", speciality: "Rice, Potato" }
    ]
  }
};

// Market price data with trends
const MARKET_PRICES = [
  { crop: "Rice (Paddy)", price: 2183, trend: "up", change: "+3.2%", category: "food", season: "kharif" },
  { crop: "Wheat", price: 2275, trend: "up", change: "+2.8%", category: "food", season: "rabi" },
  { crop: "Maize", price: 2090, trend: "down", change: "-1.5%", category: "food", season: "kharif" },
  { crop: "Bajra", price: 2500, trend: "up", change: "+4.1%", category: "food", season: "kharif" },
  { crop: "Jowar", price: 3180, trend: "stable", change: "+0.3%", category: "food", season: "kharif" },
  { crop: "Ragi", price: 3846, trend: "up", change: "+5.0%", category: "food", season: "kharif" },
  { crop: "Barley", price: 1735, trend: "down", change: "-2.1%", category: "food", season: "rabi" },
  { crop: "Gram (Chana)", price: 5440, trend: "up", change: "+3.7%", category: "food", season: "rabi" },
  { crop: "Tur (Arhar)", price: 7000, trend: "up", change: "+6.2%", category: "food", season: "kharif" },
  { crop: "Moong", price: 8558, trend: "up", change: "+4.5%", category: "food", season: "zaid" },
  { crop: "Urad", price: 6950, trend: "down", change: "-3.0%", category: "food", season: "kharif" },
  { crop: "Lentil (Masoor)", price: 6425, trend: "up", change: "+2.9%", category: "food", season: "rabi" },
  { crop: "Cotton (Medium)", price: 6620, trend: "up", change: "+5.5%", category: "cash", season: "kharif" },
  { crop: "Cotton (Long)", price: 7020, trend: "up", change: "+4.8%", category: "cash", season: "kharif" },
  { crop: "Jute", price: 5050, trend: "stable", change: "+0.5%", category: "cash", season: "kharif" },
  { crop: "Sugarcane", price: 315, trend: "up", change: "+3.3%", category: "cash", season: "kharif" },
  { crop: "Groundnut", price: 6377, trend: "up", change: "+2.4%", category: "cash", season: "kharif" },
  { crop: "Mustard (Rapeseed)", price: 5650, trend: "down", change: "-1.8%", category: "cash", season: "rabi" },
  { crop: "Soybean (Yellow)", price: 4600, trend: "up", change: "+3.9%", category: "cash", season: "kharif" },
  { crop: "Sunflower", price: 6760, trend: "stable", change: "+0.2%", category: "cash", season: "rabi" },
  { crop: "Castor Seed", price: 6540, trend: "down", change: "-2.5%", category: "cash", season: "kharif" },
  { crop: "Tobacco", price: 6500, trend: "stable", change: "+0.1%", category: "cash", season: "rabi" },
  { crop: "Coconut", price: 2800, trend: "up", change: "+4.2%", category: "plantation", season: "kharif" },
  { crop: "Arecanut", price: 55000, trend: "up", change: "+8.1%", category: "plantation", season: "kharif" },
  { crop: "Rubber", price: 17500, trend: "down", change: "-2.3%", category: "plantation", season: "kharif" },
  { crop: "Coffee (Arabica)", price: 28000, trend: "up", change: "+12.5%", category: "plantation", season: "rabi" },
  { crop: "Tea", price: 22000, trend: "up", change: "+3.9%", category: "plantation", season: "kharif" },
  { crop: "Cardamom", price: 125000, trend: "up", change: "+15.0%", category: "plantation", season: "kharif" },
  { crop: "Black Pepper", price: 65000, trend: "up", change: "+7.3%", category: "plantation", season: "kharif" },
  { crop: "Mango", price: 4500, trend: "up", change: "+5.2%", category: "horticulture", season: "zaid" },
  { crop: "Banana", price: 2200, trend: "stable", change: "+0.8%", category: "horticulture", season: "kharif" },
  { crop: "Apple", price: 12000, trend: "up", change: "+6.7%", category: "horticulture", season: "rabi" },
  { crop: "Grapes", price: 8500, trend: "down", change: "-3.2%", category: "horticulture", season: "rabi" },
  { crop: "Pomegranate", price: 11000, trend: "up", change: "+9.1%", category: "horticulture", season: "rabi" },
  { crop: "Onion", price: 1800, trend: "up", change: "+18.5%", category: "horticulture", season: "rabi" },
  { crop: "Potato", price: 1200, trend: "down", change: "-5.4%", category: "horticulture", season: "rabi" },
  { crop: "Tomato", price: 2500, trend: "up", change: "+22.3%", category: "horticulture", season: "kharif" },
  { crop: "Turmeric", price: 15000, trend: "up", change: "+11.2%", category: "horticulture", season: "rabi" },
  { crop: "Ginger", price: 18000, trend: "up", change: "+9.8%", category: "horticulture", season: "kharif" }
];

// Mock AI responses for the chat
const AI_RESPONSES = {
  greetings: [
    "Namaste! 🙏 I'm your Farm AI Assistant. I can help you with crop recommendations, pest management, soil health, weather advice, and much more. How can I help you today?",
    "Hello farmer! 🌾 Welcome to Farm AI Builder. Ask me anything about farming — from crop selection to market prices. I'm here to help!"
  ],
  pest: [
    "🐛 **Pest Management Tips:**\n\n1. **Neem Oil Spray** — Mix 5ml neem oil per litre of water. Spray early morning or evening. Effective against aphids, whiteflies, and mealybugs.\n\n2. **Yellow Sticky Traps** — Place at crop canopy level to catch whiteflies and thrips.\n\n3. **Biological Control** — Introduce Trichogramma wasps for bollworm control in cotton.\n\n4. **Crop Rotation** — Rotate with non-host crops to break pest cycles.\n\n5. **IPM Approach** — Combine cultural, biological, and chemical methods. Use chemical pesticides only as last resort.\n\n⚠️ Always follow recommended dosage and waiting periods before harvest."
  ],
  fertilizer: [
    "🧪 **Fertilizer Recommendations:**\n\n**For Rice (Kharif):**\n- Basal: DAP 100 kg/ha + MOP 60 kg/ha\n- First top-dress (21 days): Urea 65 kg/ha\n- Second top-dress (42 days): Urea 65 kg/ha\n\n**For Wheat (Rabi):**\n- Basal: DAP 130 kg/ha + MOP 50 kg/ha\n- First top-dress (21 days): Urea 75 kg/ha\n- Second top-dress (45 days): Urea 75 kg/ha\n\n**Organic Alternatives:**\n- Vermicompost: 5 tonnes/ha\n- Farmyard Manure: 10 tonnes/ha\n- Green Manuring: Dhaincha/Sunhemp\n\n💡 Get your soil tested at nearest KVK for precise recommendations!"
  ],
  soil: [
    "🌍 **Soil Health Guide:**\n\n**Key Parameters to Monitor:**\n1. **pH Level** — Ideal range: 6.0-7.5 for most crops\n2. **Organic Carbon** — Should be > 0.5%\n3. **NPK Levels** — Nitrogen, Phosphorus, Potassium\n4. **Micronutrients** — Zinc, Iron, Boron, Manganese\n\n**Improve Soil Health:**\n- Add organic matter (FYM, compost)\n- Practice green manuring\n- Use biofertilizers (Rhizobium, Azotobacter)\n- Avoid excessive chemical fertilizers\n- Mulching to retain moisture\n\n**Soil Testing:**\n- Visit nearest Soil Testing Lab or KVK\n- Test every 2-3 years\n- Collect samples from 15cm depth\n- Cost: ₹50-200 per sample\n\n📍 Find your nearest soil testing lab at soilhealth.dac.gov.in"
  ],
  weather: [
    "🌦️ **Weather & Crop Planning:**\n\n**Current Season Advisory (Kharif 2026):**\n- IMD predicts normal monsoon this year\n- Sowing window: June 15 – July 15 for most regions\n- Keep seeds ready for timely sowing\n\n**Weather-based Recommendations:**\n- 🌧️ **Heavy Rain Alert:** Ensure proper drainage, delay fertilizer application\n- ☀️ **Heat Wave:** Irrigate during evening, use mulching, provide shade for nurseries\n- 💨 **Strong Winds:** Stake tall crops, delay spraying operations\n\n**Resources:**\n- Meghdoot App for village-level forecasts\n- Kisan Call Center: 1800-180-1551 (toll-free)\n- Damini App for lightning alerts\n\n💡 Subscribe to mKisan SMS service for daily weather updates!"
  ],
  irrigation: [
    "💧 **Irrigation Guide:**\n\n**Efficient Irrigation Methods:**\n1. **Drip Irrigation** — 90% efficiency, saves 30-50% water\n   - Best for: Vegetables, fruits, flowers\n   - Subsidy: 55-90% under PMKSY\n\n2. **Sprinkler System** — 75% efficiency\n   - Best for: Field crops, pulses\n   - Subsidy: 55-90% under PMKSY\n\n3. **Furrow Irrigation** — For row crops\n4. **Alternate Wetting & Drying** — For paddy, saves 25% water\n\n**Water Conservation:**\n- Farm ponds for rainwater harvesting\n- Mulching to reduce evaporation\n- Schedule irrigation based on crop stage\n\n**Government Schemes:**\n- PM Krishi Sinchayee Yojana (PMKSY)\n- Per Drop More Crop component\n\n📞 Contact: Your District Agriculture Office for subsidy details"
  ],
  scheme: [
    "🏛️ **Government Schemes for Farmers:**\n\n1. **PM-KISAN** — ₹6,000/year direct income support\n2. **PM Fasal Bima Yojana** — Crop insurance at minimal premium\n3. **Kisan Credit Card (KCC)** — Loans up to ₹3 lakh at 4% interest\n4. **PM-KUSUM** — Solar pumps subsidy (60-90%)\n5. **Soil Health Card** — Free soil testing & recommendations\n6. **e-NAM** — Online produce marketing platform\n7. **PMKSY** — Micro-irrigation subsidy (55-90%)\n8. **Rashtriya Krishi Vikas Yojana** — Infrastructure support\n\n**How to Apply:**\n- Visit nearest CSC (Common Service Centre)\n- Use mKisan portal: mkisan.gov.in\n- Contact Block Agriculture Officer\n\n📞 Kisan Call Center: 1800-180-1551 (24x7, toll-free)"
  ],
  organic: [
    "🌿 **Organic Farming Guide:**\n\n**Getting Started:**\n1. Get organic certification (3-year transition period)\n2. Prepare organic manures on-farm\n3. Use biopesticides and bio-agents\n\n**Organic Inputs:**\n- **Jeevamrut** — Fermented cow dung solution for soil health\n- **Panchagavya** — Growth promoter from 5 cow products\n- **Dashparni Ark** — 10-leaf extract pesticide\n- **Trichoderma** — Bio-fungicide\n- **Beauveria bassiana** — Bio-insecticide\n\n**Certification:**\n- PGS-India (Participatory Guarantee System) — Free, group-based\n- NPOP Certification — For export market\n\n**Market Premium:** 20-100% over conventional produce\n\n**Support:**\n- Paramparagat Krishi Vikas Yojana (PKVY)\n- ₹50,000/ha support over 3 years"
  ],
  default: [
    "🌾 I can help you with many farming topics! Here are some things you can ask me about:\n\n• **Crop Recommendations** — \"Which crop should I grow this season?\"\n• **Pest & Disease Management** — \"How to control pests in rice?\"\n• **Fertilizer Advice** — \"What fertilizer for wheat crop?\"\n• **Soil Health** — \"How to improve soil quality?\"\n• **Weather Advisory** — \"Weather tips for farming\"\n• **Irrigation** — \"Best irrigation method for vegetables?\"\n• **Government Schemes** — \"Tell me about PM-KISAN\"\n• **Organic Farming** — \"How to start organic farming?\"\n• **Market Prices** — \"Current mandi prices\"\n\nJust type your question and I'll do my best to help! 🚜"
  ]
};

// Mock disease detection responses
const DISEASE_DETECTIONS = [
  {
    disease: "Bacterial Leaf Blight",
    confidence: "87%",
    crop: "Rice",
    severity: "Moderate",
    description: "Water-soaked lesions on leaf margins that turn yellow to white as they enlarge.",
    fertilizer: "Apply Potassium fertilizer (MOP 30 kg/ha) to strengthen plant resistance",
    pesticide: "Spray Streptomycin sulfate + Tetracycline (300 ppm) or Copper Oxychloride 0.3%",
    advice: "• Ensure proper field drainage\n• Avoid excess nitrogen fertilizer\n• Use resistant varieties (Pusa Basmati 1121)\n• Remove infected plant debris\n• Maintain optimum spacing for air circulation"
  },
  {
    disease: "Late Blight",
    confidence: "92%",
    crop: "Potato / Tomato",
    severity: "High",
    description: "Dark brown to black water-soaked lesions on leaves and stems. White mold growth on undersides.",
    fertilizer: "Balanced NPK (120:60:80 kg/ha) with extra Phosphorus for root strength",
    pesticide: "Spray Mancozeb 75% WP (2.5g/L) or Metalaxyl + Mancozeb (2.5g/L) at 7-day intervals",
    advice: "• Remove and destroy infected plants immediately\n• Avoid overhead irrigation\n• Ensure good air circulation\n• Apply fungicide preventively in humid weather\n• Use certified disease-free seed tubers"
  },
  {
    disease: "Powdery Mildew",
    confidence: "94%",
    crop: "Various Crops",
    severity: "Low to Moderate",
    description: "White powdery fungal growth on upper leaf surfaces. Leaves may curl and turn yellow.",
    fertilizer: "Apply Sulphur-based fertilizer, reduce nitrogen, increase potassium",
    pesticide: "Spray Sulphur 80% WP (3g/L) or Hexaconazole 5% EC (1ml/L)",
    advice: "• Improve air circulation with proper spacing\n• Avoid wetting foliage\n• Remove heavily infected leaves\n• Spray neem oil (5ml/L) as organic alternative\n• Grow resistant varieties"
  },
  {
    disease: "Yellow Mosaic Virus",
    confidence: "89%",
    crop: "Moong / Soybean",
    severity: "High",
    description: "Irregular yellow patches on leaves in mosaic pattern. Transmitted by whiteflies.",
    fertilizer: "Foliar spray of Zinc sulphate (0.5%) + Urea (2%) to boost immunity",
    pesticide: "Control whitefly vector: Imidacloprid 17.8 SL (0.3ml/L) or Thiamethoxam 25 WG (0.3g/L)",
    advice: "• Grow resistant varieties (SML 668, Pusa Vishal)\n• Rogue out infected plants early\n• Install yellow sticky traps\n• Avoid late sowing\n• Seed treatment with Imidacloprid 70 WS (5g/kg seed)"
  },
  {
    disease: "Rust (Leaf Rust)",
    confidence: "91%",
    crop: "Wheat",
    severity: "Moderate to High",
    description: "Orange-brown pustules (uredinia) on leaf surfaces. Severely affected leaves dry up.",
    fertilizer: "Balanced NPK with emphasis on Potassium (MOP 60 kg/ha)",
    pesticide: "Spray Propiconazole 25 EC (1ml/L) or Tebuconazole 25.9 EC (1ml/L). Two sprays at 15-day interval.",
    advice: "• Grow resistant varieties (HD 3086, DBW 187)\n• Timely sowing (Nov 1-25 for North India)\n• Avoid excess nitrogen\n• Monitor fields regularly from January\n• Early detection and spraying is crucial"
  }
];

// Helper function to get AI response based on user query
function getAIResponse(query) {
  const q = query.toLowerCase();
  if (q.match(/\b(hi|hello|hey|namaste|namaskar)\b/)) return AI_RESPONSES.greetings[Math.floor(Math.random() * AI_RESPONSES.greetings.length)];
  if (q.match(/\b(pest|insect|bug|keeda|keet|kira)\b/)) return AI_RESPONSES.pest[0];
  if (q.match(/\b(fertilizer|khad|urea|dap|manure|fertiliser)\b/)) return AI_RESPONSES.fertilizer[0];
  if (q.match(/\b(soil|mitti|land|bhumi|earth)\b/)) return AI_RESPONSES.soil[0];
  if (q.match(/\b(weather|mausam|rain|barish|temperature|climate)\b/)) return AI_RESPONSES.weather[0];
  if (q.match(/\b(water|irrigation|sinchai|drip|sprinkler|paani|pani)\b/)) return AI_RESPONSES.irrigation[0];
  if (q.match(/\b(scheme|yojana|subsidy|government|sarkari|pm-kisan|pmkisan|loan|kcc)\b/)) return AI_RESPONSES.scheme[0];
  if (q.match(/\b(organic|jaivik|natural|chemical.free|prakritik)\b/)) return AI_RESPONSES.organic[0];
  return AI_RESPONSES.default[0];
}

// Helper to get random disease detection
function getRandomDisease() {
  return DISEASE_DETECTIONS[Math.floor(Math.random() * DISEASE_DETECTIONS.length)];
}
