const fs = require('fs');

const dataPath = './src/data/universities.json';
const rawData = fs.readFileSync(dataPath, 'utf-8');
const universities = JSON.parse(rawData);

const updates = {
  "Indian Institute of Technology Bombay": [
    { name: "Computer Science and Engineering", cutoffRank: "68" },
    { name: "Electrical Engineering", cutoffRank: "496" },
    { name: "Mechanical Engineering", cutoffRank: "1685" },
    { name: "Civil Engineering", cutoffRank: "4217" },
    { name: "Chemical Engineering", cutoffRank: "2470" },
    { name: "Aerospace Engineering", cutoffRank: "2368" },
    { name: "Metallurgical Engineering", cutoffRank: "4579" }
  ],
  "Indian Institute of Technology Delhi": [
    { name: "Computer Science and Engineering", cutoffRank: "116" },
    { name: "Electrical Engineering", cutoffRank: "625" },
    { name: "Mathematics and Computing", cutoffRank: "332" },
    { name: "Mechanical Engineering", cutoffRank: "1756" },
    { name: "Civil Engineering", cutoffRank: "4181" },
    { name: "Chemical Engineering", cutoffRank: "2320" }
  ],
  "Indian Institute of Technology Madras": [
    { name: "Computer Science and Engineering", cutoffRank: "159" },
    { name: "Artificial Intelligence and Data Science", cutoffRank: "419" },
    { name: "Electrical Engineering", cutoffRank: "838" },
    { name: "Mechanical Engineering", cutoffRank: "2603" },
    { name: "Civil Engineering", cutoffRank: "5882" },
    { name: "Chemical Engineering", cutoffRank: "4114" },
    { name: "Aerospace Engineering", cutoffRank: "3262" }
  ],
  "Indian Institute of Technology Kanpur": [
    { name: "Computer Science and Engineering", cutoffRank: "252" },
    { name: "Electrical Engineering", cutoffRank: "1290" },
    { name: "Mechanical Engineering", cutoffRank: "2755" },
    { name: "Civil Engineering", cutoffRank: "5971" },
    { name: "Chemical Engineering", cutoffRank: "3959" },
    { name: "Aerospace Engineering", cutoffRank: "3824" }
  ],
  "Indian Institute of Technology Kharagpur": [
    { name: "Computer Science and Engineering", cutoffRank: "415" },
    { name: "Mathematics and Computing", cutoffRank: "1291" },
    { name: "Electrical Engineering", cutoffRank: "2016" },
    { name: "Mechanical Engineering", cutoffRank: "3209" },
    { name: "Civil Engineering", cutoffRank: "6994" },
    { name: "Chemical Engineering", cutoffRank: "4627" },
    { name: "Aerospace Engineering", cutoffRank: "4400" }
  ],
  "Indian Institute of Technology Roorkee": [
    { name: "Computer Science and Engineering", cutoffRank: "481" },
    { name: "Data Science and Artificial Intelligence", cutoffRank: "822" },
    { name: "Electrical Engineering", cutoffRank: "2168" },
    { name: "Electronics and Communication Engineering", cutoffRank: "1420" },
    { name: "Mechanical Engineering", cutoffRank: "4189" },
    { name: "Civil Engineering", cutoffRank: "7100" },
    { name: "Chemical Engineering", cutoffRank: "5288" }
  ],
  "Indian Institute of Technology Guwahati": [
    { name: "Computer Science and Engineering", cutoffRank: "654" },
    { name: "Data Science and Artificial Intelligence", cutoffRank: "1028" },
    { name: "Electrical Engineering", cutoffRank: "2338" },
    { name: "Mechanical Engineering", cutoffRank: "4595" },
    { name: "Civil Engineering", cutoffRank: "7976" },
    { name: "Chemical Engineering", cutoffRank: "5511" }
  ],
  "Indian Institute of Technology Hyderabad": [
    { name: "Computer Science and Engineering", cutoffRank: "649" },
    { name: "Artificial Intelligence", cutoffRank: "847" },
    { name: "Electrical Engineering", cutoffRank: "2604" },
    { name: "Mechanical Engineering", cutoffRank: "5043" },
    { name: "Civil Engineering", cutoffRank: "8226" },
    { name: "Chemical Engineering", cutoffRank: "6593" }
  ],
  "Indian Institute of Technology (BHU) Varanasi": [
    { name: "Computer Science and Engineering", cutoffRank: "1050" },
    { name: "Electrical Engineering", cutoffRank: "3545" },
    { name: "Mechanical Engineering", cutoffRank: "6503" },
    { name: "Civil Engineering", cutoffRank: "9832" },
    { name: "Chemical Engineering", cutoffRank: "8523" }
  ],
  "National Institute of Technology Tiruchirappalli": [
    { name: "Computer Science and Engineering", cutoffRank: "1030" },
    { name: "Electrical and Electronics Engineering", cutoffRank: "3970" },
    { name: "Mechanical Engineering", cutoffRank: "6250" },
    { name: "Civil Engineering", cutoffRank: "12500" },
    { name: "Chemical Engineering", cutoffRank: "8450" }
  ],
  "National Institute of Technology Karnataka": [
    { name: "Computer Science and Engineering", cutoffRank: "1528" },
    { name: "Information Technology", cutoffRank: "2350" },
    { name: "Electrical and Electronics Engineering", cutoffRank: "4689" },
    { name: "Mechanical Engineering", cutoffRank: "8520" },
    { name: "Civil Engineering", cutoffRank: "16500" },
    { name: "Chemical Engineering", cutoffRank: "10350" }
  ],
  "National Institute of Technology Rourkela": [
    { name: "Computer Science and Engineering", cutoffRank: "2800" },
    { name: "Electrical Engineering", cutoffRank: "7542" },
    { name: "Mechanical Engineering", cutoffRank: "11500" },
    { name: "Civil Engineering", cutoffRank: "21500" },
    { name: "Chemical Engineering", cutoffRank: "15200" }
  ],
  "Jadavpur University": [
    { name: "Computer Science and Engineering", cutoffRank: "50" },
    { name: "Information Technology", cutoffRank: "120" },
    { name: "Electrical Engineering", cutoffRank: "150" },
    { name: "Mechanical Engineering", cutoffRank: "250" },
    { name: "Civil Engineering", cutoffRank: "400" },
    { name: "Chemical Engineering", cutoffRank: "300" }
  ]
};

let count = 0;
universities.forEach(uni => {
  if (updates[uni.name]) {
    uni.branches = updates[uni.name];
    count++;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(universities, null, 2));
console.log(`Updated ${count} top universities with comprehensive engineering branches and cutoff ranks.`);
