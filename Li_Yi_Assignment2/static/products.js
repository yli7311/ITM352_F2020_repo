var products = [
  {
    "name": "Full Button Set",
    "price": 6.00,
    "image": "https://dzasv7x7a867v.cloudfront.net/product_photos/85182271/file_0b8152e4e1_400w.png"
  },
  {
    "name": "Pikachu",
    "price": 1.75,
    "image": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/33299c18-c6ff-4bf4-9bc2-dbf6c1724f01/de822bf-3e9eb395-711f-4171-bb00-75dea9646751.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMzMyOTljMTgtYzZmZi00YmY0LTliYzItZGJmNmMxNzI0ZjAxXC9kZTgyMmJmLTNlOWViMzk1LTcxMWYtNDE3MS1iYjAwLTc1ZGVhOTY0Njc1MS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ._JokkshoaOBWAg7-O6wfxRoP9lM_sfv-jTC3u7nYpBk"
  },
  {
    "name": "Scorbunny",
    "price": 1.75,
    "image": "https://pbs.twimg.com/media/D3JW_taVYAEFfkO?format=png&name=small"
  },

  {
    "name": "Sobble",
    "price": 1.75,
    "image": "https://pbs.twimg.com/media/D3JW_taUwAART69?format=png&name=small"
  },

  {
    "name": "Grookey",
    "price": 1.75,
    "image": "https://pbs.twimg.com/media/D3JW_tdVAAA-Wen?format=png&name=small"
  }
];

//export data if type of module is defined 
if(typeof module != 'undefined') {
  module.exports.products = products;
}