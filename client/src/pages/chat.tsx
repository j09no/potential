import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Paperclip, Smile, Mic, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: "user";
}

// Flask API URL
const CHAT_API_URL = 'https://d33b02ca-b16d-48ca-97df-a8dd5f622b71-00-j3w4z2qff2ue.sisko.replit.dev/api/messages';

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from Flask SQLite database
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(CHAT_API_URL);
        if (response.ok) {
          const data = await response.json();
          const formattedMessages = data.map((msg: any) => ({
            id: msg.id,
            text: msg.text,
            timestamp: msg.timestamp,
            sender: msg.sender
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading messages from Flask database:', error);
      }
    };

    loadMessages();
  }, []);

  const alphabets = [
    // Smileys & Emotion
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "🫠", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🫣", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "🫤", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "🥹", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",

    // People & Body
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "🩸",

    // Animals & Nature
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🦣", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🪶", "🐓", "🦃", "🦤", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦫", "🦦", "🦥", "🐁", "🐀", "🐿️", "🦔", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🪵", "🌱", "🌿", "☘️", "🍀", "🎍", "🪴", "🎋", "🍃", "🍂", "🍁", "🍄", "🐚", "🪨", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "Saturn", "💫", "⭐", "🌟", "✨", "⚡", "☄️", "💥", "🔥", "🌪️", "🌈", "☀️", "🌤️", "⛅", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "💧", "💦", "☔", "☂️", "🌊", "🌫️",

    // Food & Drink
    "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🫘", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "Burrito", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🫗", "🥤", "🧋", "🧃", "Yerba Mate", "🧊",

    // Travel & Places
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "Tuk Tuk", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "Tram", "🚞", "Monorail", "High-Speed Train", "Bullet Train", "Light Rail", "Locomotive", "Train", "Subway", "Streetcar", "Station", "✈️", "Departure", "Arrival", "🛩️", "Seat", "🛰️", "🚀", "Flying Saucer", "🚁", "Canoe", "Sailboat", "Speedboat", "Motorboat", "Passenger Ship", "Ferry", "Ship", "Anchor", "Hook", "⛽", "🚧", "🚦", "Traffic Light", "🗺️", "Moai", "Statue of Liberty", "Tokyo Tower", "Castle", "Japanese Castle", "Stadium", "Ferris Wheel", "Roller Coaster", "Carousel", "Fountain", "Parasol", "Beach with Umbrella", "Desert Island", "Desert", "Volcano", "Mountain", "Snow-Capped Mountain", "Mount Fuji", "Camping", "Tent", "Hut", "House", "Home", "Houses", "Derelict House", "Building Construction", "Factory", "Office Building", "Department Store", "Post Office", "European Post Office", "Hospital", "Bank", "Hotel", "Convenience Store", "School", "Love Hotel", "Classical Building", "Church", "Mosque", "Hindu Temple", "Synagogue", "Kaaba", "Shinto Shrine", "Railway Track", "Highway", "Map of Japan", "Moon Viewing Ceremony", "National Park", "Sunrise", "Sunrise Over Mountains", "Shooting Star", "Fireworks", "Sparkler", "Sunset", "Cityscape at Dusk", "Cityscape", "Night with Stars", "Bridge", "Fog",

    // Objects
    "⌚", "Mobile Phone", "Mobile Phone with Arrow", "Laptop", "Keyboard", "Desktop Computer", "Printer", "Mouse", "Trackball", "Joystick", "Compression", "Computer Disk", "Floppy Disk", "Optical Disc", "DVD", "Videocassette", "Camera", "Camera with Flash", "Video Camera", "Movie Camera", "Film Projector", "Film Frames", "Telephone Receiver", "Telephone", "Pager", "Fax Machine", "Television", "Radio", "Studio Microphone", "Level Slider", "Control Knobs", "Compass", "Stopwatch", "Timer Clock", "Alarm Clock", "Mantelpiece Clock", "Hourglass Done", "Hourglass Not Done", "Satellite Antenna", "Battery", "Low Battery", "Electric Plug", "Light Bulb", "Flashlight", "Candle", "Diya Lamp", "Extinguisher", "Oil Drum", "Money with Wings", "Dollar Banknote", "Yen Banknote", "Euro Banknote", "Pound Banknote", "Coin", "Money Bag", "Credit Card", "Gem Stone", "Balance Scale", "Ladder", "Toolbox", "Wrench", "Hammer", "Pick", "Hammer and Pick", "Axe", "Screwdriver", "Nut and Bolt", "Gear", "Mouse Trap", "Brick", "Chains", "Magnet", "Pistol", "Bomb", "Firecracker", "Axe", "Knife", "Dagger", "Crossed Swords", "Shield", "Cigarette", "Coffin", "Headstone", "Funeral Urn", "Amphora", "Crystal Ball", "Prayer Beads", "Hamsa", "Barber Pole", "Alembic", "Telescope", "Microscope", "Hole", "Adhesive Bandage", "Stethoscope", "Pill", "Syringe", "Drop of Blood", "DNA", "Microbe", "Petri Dish", "Test Tube", "Thermometer", "Broom", "Plunger", "Sponge", "Lotion Bottle", "Bellhop Bell", "Key", "Old Key", "Door", "Chair", "Couch", "Bed", "Person in Bed", "Teddy Bear", "Nesting Dolls", "Frame with Picture", "Mirror", "Window", "Shopping Bags", "Shopping Cart", "Gift", "Balloon", "Carp Streamer", "Ribbon", "Magic Wand", "Piñata", "Confetti Ball", "Party Popper", "Japanese Dolls", "Red Paper Lantern", "Wind Chime", "Red Envelope", "Envelope", "Envelope with Downwards Arrow Above", "Incoming Envelope", "E-Mail", "Love Letter", "Inbox Tray", "Outbox Tray", "Package", "Label", "Bookmark", "Open Mailbox with Raised Flag", "Open Mailbox with Lowered Flag", "Closed Mailbox with Raised Flag", "Closed Mailbox with Lowered Flag", "Postal Horn", "Scroll", "Page with Curl", "Page Facing Up", "Bookmark Tabs", "Receipt", "Bar Chart", "Chart Increasing", "Chart Decreasing", "Memo", "Spiral Calendar Pad", "Calendar", "Tear-Off Calendar", "Wastebasket", "Card Index", "Card File Box", "File Cabinet", "Clipboard", "File Folder", "Open File Folder", "Card Index Dividers", "Newspaper", "Notebook", "Notebook with Decorative Cover", "Ledger", "Closed Book", "Green Book", "Blue Book", "Orange Book", "Books", "Open Book", "Bookmark", "Paperclip", "Link", "Triangular Ruler", "Straight Ruler", "Abacus", "Pushpin", "Round Pushpin", "Scissors", "Pen", "Fountain Pen", "Black Nib", "Paintbrush", "Crayon", "Memo", "Pencil", "Magnifying Glass Tilted Left", "Magnifying Glass Tilted Right", "Locked with Pen", "Lock", "Open Lock",

    // Symbols
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "Broken Heart", "Heavy Heart Exclamation", "Two Hearts", "Revolving Hearts", "Beating Heart", "Sparkling Heart", "Growing Heart", "Heart with Arrow", "Heart with Ribbon", "Decorative Heart", "Peace Symbol", "Latin Cross", "Star and Crescent", "Om", "Wheel of Dharma", "Star of David", "Six-Pointed Star with Middle Dot", "Menorah", "Yin Yang", "Orthodox Cross", "Place of Worship", "Ophiuchus", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces", "ID Button", "Atom Symbol", "Acceptance", "Radioactive", "Biohazard", "Mobile Phone Off", "Vibration Mode", "Japanese “Not Free of Charge” Button", "Japanese “Open for Business” Button", "Japanese “Application” Button", "Japanese “Service Charge” Button", "Japanese “Monthly Amount” Button", "Japanese “Vacancy” Button", "Japanese “Congratulations” Button", "Japanese “Secret” Button", "Japanese “You’re Doing Well” Button", "Japanese “Bargain” Button", "Japanese “Passing Grade” Button", "Japanese “Full” Button", "Japanese “Discount” Button", "Japanese “Prohibited” Button", "A Button (Blood Type)", "B Button (Blood Type)", "AB Button (Blood Type)", "CL Button", "O Button (Blood Type)", "SOS Button", "Heavy Multiplication X", "Heavy Large Circle", "Stop Sign", "Entry Forbidden", "Name Badge", "Prohibited", "Hundred Points", "Anger Symbol", "Hot Springs", "No Pedestrians", "No Littering", "No Mobile Phones", "Non-Potable Water Symbol", "Not Under 18 Symbol", "No Mobile Phones", "No Smoking", "Exclamation Mark", "White Exclamation Mark Ornament", "Question Mark", "White Question Mark Ornament", "Double Exclamation Mark", "Question Exclamation Mark", "Low Brightness", "High Brightness", "Part Alternation Mark", "Warning", "Children Crossing", "Trident Emblem", "Fleur-De-Lis", "Japanese Symbol for Beginner", "Recycling Symbol", "Check Mark Button", "Japanese “Reserved” Button", "Currency Exchange", "Sparkle", "Eight Spoked Asterisk", "Negative Squared Cross Mark", "Globe with Meridians", "Diamond Shape with a Dot Inside", "Circled M", "Cyclone", "Sleeping Symbol", "ATM Sign", "Wheelchair Symbol", "P Button", "Elevator", "Japanese “Free of Charge” Button", "Japanese “Reserved Seat” Button", "Passport Control", "Customs", "Baggage Claim", "Left Luggage", "Men’s Room", "Women’s Room", "Baby Symbol", "Transgender Symbol", "Restroom", "Litter in Bin Sign", "Cinema", "Signal Strength", "Japanese “Here” Button", "Input Symbol for Symbols", "Information", "Input Symbol for Latin Letters", "Input Symbol for Lowercase Latin Letters", "Input Symbol for Uppercase Latin Letters", "NG Button", "OK Button", "Up Button", "Cool Button", "New Button", "Free Button", "Keycap 0", "Keycap 1", "Keycap 2", "Keycap 3", "Keycap 4", "Keycap 5", "Keycap 6", "Keycap 7", "Keycap 8", "Keycap 9", "Keycap 10", "Keycap Number Sign", "Keycap Asterisk", "Eject Button", "Black Right-Pointing Triangle", "Double Vertical Bar", "Black Right-Pointing Double Triangle with Vertical Bar", "Black Square Button", "Record Button", "Black Right-Pointing Triangle to Next Track Button", "Black Left-Pointing Triangle to Previous Track Button", "Fast-Forward Button", "Rewind Button", "Upwards Button", "Downwards Button", "Black Left-Pointing Triangle", "Up-Pointing Small Red Triangle", "Down-Pointing Small Red Triangle", "Black Right-Pointing Triangle", "Black Left-Pointing Triangle", "Upwards Black Arrow", "Downwards Black Arrow", "North East Arrow", "South East Arrow", "South West Arrow", "North West Arrow", "Up Down Arrow", "Left Right Arrow", "Right Arrow Curving Left", "Left Arrow Curving Right", "Right Arrow Curving Up", "Right Arrow Curving Down", "Shuffle Tracks Button", "Clockwise Rightwards and Leftwards Open Circle Arrows", "Anticlockwise Downwards and Upwards Open Circle Arrows", "Clockwise Downwards and Upwards Open Circle Arrows", "Anticlockwise Arrows Button", "Musical Note", "Multiple Musical Notes", "Heavy Plus Sign", "Heavy Minus Sign", "Division Sign", "Heavy Multiplication X", "Heavy Equals Sign", "Infinity", "Heavy Dollar Sign", "Currency Sign", "Trade Mark Sign", "Copyright Sign", "Registered Sign", "Wavy Dash", "Curly Loop", "Double Curly Loop", "End with Leftwards Arrow Above", "Back with Leftwards Arrow Above", "On! Arrow", "Top with Upwards Arrow Above", "Soon with Rightwards Arrow Above", "Check Mark", "Ballot Box with Check", "Radio Button", "Red Circle", "Orange Circle", "Yellow Circle", "Green Circle", "Blue Circle", "Purple Circle", "Black Circle", "White Circle", "Brown Circle", "Broken Heart", "Heavy Heart Exclamation", "Two Hearts", "Revolving Hearts", "Beating Heart", "Sparkling Heart", "Growing Heart", "Heart with Arrow", "Heart with Ribbon", "Decorative Heart", "Black Spade Suit", "Black Club Suit", "Black Heart Suit", "Black Diamond Suit", "Playing Card Black Joker", "Mahjong Tile Red Dragon", "Joker", "One O’Clock", "Two O’Clock", "Three O’Clock", "Four O’Clock", "Five O’Clock", "Six O’Clock", "Seven O’Clock", "Eight O’Clock", "Nine O’Clock", "Ten O’Clock", "Eleven O’Clock", "Twelve O’Clock", "One-Thirty", "Two-Thirty", "Three-Thirty", "Four-Thirty", "Five-Thirty", "Six-Thirty", "Seven-Thirty", "Eight-Thirty", "Nine-Thirty", "Ten-Thirty", "Eleven-Thirty", "Twelve-Thirty",

    // Flags
    "🏁", "🚩", "Japanese Flag", "Black Flag", "White Flag", "Rainbow Flag", "Transgender Flag", "Pirate Flag", "Ascension Island", "Andorra", "United Arab Emirates", "Afghanistan", "Antigua & Barbuda", "Anguilla", "Albania", "Armenia", "Angola", "Antarctica", "Argentina", "American Samoa", "Austria", "Australia", "Aruba", "Åland Islands", "Azerbaijan", "Bosnia & Herzegovina", "Barbados", "Bangladesh", "Belgium", "Burkina Faso", "Bulgaria", "Bahrain", "Burundi", "Benin", "St. Barthélemy", "Bermuda", "Brunei", "Bolivia", "Caribbean Netherlands", "Brazil", "Bahamas", "Bhutan", "Bouvet Island", "Botswana", "Belarus", "Belize", "Canada", "Cocos (Keeling) Islands", "Congo - Kinshasa", "Central African Republic", "Congo - Brazzaville", "Switzerland", "Côte d’Ivoire", "Cook Islands", "Chile", "Cameroon", "China", "Colombia", "Clipperton Island", "Costa Rica", "Cuba", "Cape Verde", "Curaçao", "Christmas Island", "Cyprus", "Czechia", "Germany", "Diego Garcia", "Djibouti", "Denmark", "Dominica", "Dominican Republic", "Algeria", "Ceuta & Melilla", "Ecuador", "Estonia", "Egypt", "Western Sahara", "Eritrea", "Spain", "Ethiopia", "European Union", "Finland", "Fiji", "Falkland Islands", "Micronesia", "Faroe Islands", "France", "Gabon", "United Kingdom", "Grenada", "Georgia", "French Guiana", "Guernsey", "Ghana", "Gibraltar", "Greenland", "Gambia", "Guinea", "Guadeloupe", "Equatorial Guinea", "Greece", "South Georgia & South Sandwich Islands", "Guatemala", "Guam", "Guinea-Bissau", "Guyana", "Hong Kong SAR China", "Heard & McDonald Islands", "Honduras", "Croatia", "Haiti", "Hungary", "Canary Islands", "Indonesia", "Ireland", "Israel", "Isle of Man", "India", "British Indian Ocean Territory", "Iraq", "Iran", "Iceland", "Italy", "Jersey", "Jamaica", "Jordan", "Japan", "Kenya", "Kyrgyzstan", "Cambodia", "Kiribati", "Comoros", "St. Kitts & Nevis", "North Korea", "South Korea", "Kuwait", "Cayman Islands", "Kazakhstan", "Laos", "Lebanon", "St. Lucia", "Liechtenstein", "Sri Lanka", "Liberia", "Lesotho", "Lithuania", "Luxembourg", "Latvia", "Libya", "Morocco", "Monaco", "Moldova", "Montenegro", "St. Martin", "Madagascar", "Marshall Islands", "Macedonia", "Mali", "Myanmar (Burma)", "Mongolia", "Macau SAR China", "Northern Mariana Islands", "Martinique", "Mauritania", "Montserrat", "Malta", "Mauritius", "Maldives", "Malawi", "Mexico", "Malaysia", "Mozambique", "Namibia", "New Caledonia", "Niger", "Norfolk Island", "Nigeria", "Nicaragua", "Netherlands", "Norway", "Nepal", "Nauru", "Niue", "New Zealand", "Oman", "Panama", "Peru", "French Polynesia", "Papua New Guinea", "Philippines", "Pakistan", "Poland", "St. Pierre & Miquelon", "Pitcairn Islands", "Puerto Rico", "Palestinian Territories", "Portugal", "Palau", "Paraguay", "Qatar", "Réunion", "Romania", "Serbia", "Russia", "Rwanda", "Saudi Arabia", "Solomon Islands", "Seychelles", "Sudan", "Sweden", "Singapore", "St. Helena", "Slovenia", "Svalbard & Jan Mayen", "Slovakia", "Sierra Leone", "San Marino", "Senegal", "Somalia", "Suriname", "South Sudan", "São Tomé & Príncipe", "El Salvador", "Sint Maarten", "Syria", "Swaziland", "Turks & Caicos Islands", "Chad", "French Southern Territories", "Togo", "Thailand", "Tajikistan", "Tokelau", "Timor-Leste", "Turkmenistan", "Tunisia", "Tonga", "Turkey", "Trinidad & Tobago", "Tuvalu", "Taiwan", "Tanzania", "Ukraine", "Uganda", "U.S. Outlying Islands", "United Nations", "United States", "Uruguay", "Uzbekistan", "Vatican City", "St. Vincent & Grenadines", "Venezuela", "British Virgin Islands", "U.S. Virgin Islands", "Vietnam", "Vanuatu", "Wallis & Futuna", "Samoa", "Kosovo", "Yemen", "Mayotte", "South Africa", "Zambia", "Zimbabwe"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      timestamp: new Date().toISOString(),
      sender: "user"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Save message to Flask SQLite database
    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage.text,
          sender: newMessage.sender,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save message');
      }

      // Optionally reload messages to sync with database
      const updatedResponse = await fetch(CHAT_API_URL);
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          timestamp: msg.timestamp,
          sender: msg.sender
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error saving message to Flask database:', error);
    }
  };

  const handleAlphabetSelect = (alphabet: string) => {
    setMessage(prev => prev + alphabet);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#18181b] p-4">
      <div className="relative p-4 w-full max-w-xl max-h-full">
        <div className="relative bg-[#27272a] rounded-lg shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-700 rounded-t">
            <h3 className="text-lg font-bold text-white">
              Send Message
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Messages Display */}
          <div className="p-4 max-h-96 overflow-y-auto border-b border-gray-700">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No messages yet</p>
                <p className="text-sm mt-1">Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 bg-blue-500 text-white rounded-lg">
                      <p className="text-sm" style={{ fontFamily: 'Milker, "SF Pro Display", "iOS Emoji", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", monospace, sans-serif' }}>{msg.text}</p>
                      <p className="text-xs text-blue-100 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-5">
            <div className="relative mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-4 pb-12 block w-full h-60 bg-[#18181b] border border-gray-700 rounded-lg text-white text-md focus:border-gray-600 focus:ring-0 focus:outline-none resize-none placeholder-gray-400"
                placeholder="Write a message..."
                style={{ fontFamily: 'Milker, "SF Pro Display", monospace, sans-serif' }}
                required
              />

              {/* Bottom Controls */}
              <div className="absolute bottom-0 inset-x-0 p-2 rounded-b-md">
                <div className="flex justify-between items-center">
                  {/* Left Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      className="inline-flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <label htmlFor="image" className="cursor-pointer">
                        <ImageIcon className="w-5 h-5" />
                        <input name="image" id="image" type="file" className="hidden" accept="image/*" />
                      </label>
                    </button>

                    <button
                      type="button"
                      className="inline-flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <label htmlFor="attachment" className="cursor-pointer">
                        <Paperclip className="w-5 h-5" />
                        <input name="attachment" id="attachment" type="file" className="hidden" />
                      </label>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="inline-flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-x-1">
                    <button
                      type="button"
                      className="inline-flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="inline-flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Count */}
            <div className="text-xs text-gray-400 text-right">
              {message.length}/1000
            </div>
          </form>
        </div>

        {/* Alphabet Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 right-4 bg-[#27272a] border border-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Select Letter</h4>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {alphabets.map((alphabet, index) => (
                <button
                  key={index}
                  onClick={() => handleAlphabetSelect(alphabet)}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-700 rounded transition-colors"
                  style={{ fontFamily: 'Milker, "SF Pro Display", monospace, sans-serif' }}
                >
                  {alphabet}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}