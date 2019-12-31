var message = "http://maps.google.cn/maps?q=N40.93956%2cW008.53900\n\
ID:9171072755\n\
ACC:OFF\n\
GPS:A\n\
Speed:38.00KM/H\n\
19-12-30 03:20:08";

var fields = message.split("\n");
var data = {
	coords: null,
	id: -1,
	acc: false,
	gps: false,
	speed: 0,
	date: ''
};

console.log(fields);

var url = fields[0];

data.id = Number.parseInt(fields[1].split(":")[1]);
data.acc = fields[2].split(":")[1] !== "OFF";
data.gps = fields[3].split(":")[1] === "A";
data.speed = Number.parseFloat(fields[4].split(":")[1]);
data.date = fields[5];

console.log(data);