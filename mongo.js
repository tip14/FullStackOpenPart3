const mongoose = require('mongoose');

const mongoPassword = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if(!mongoPassword) {
	console.log('Mongo password is not provided. Exiting');
	return;
}

const mongoUrl = `mongodb+srv://fullstack:${mongoPassword}@cluster0.gmnxx.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl);

const personSchema = new mongoose.Schema({
	name: String,
	number: String
});

const Person = mongoose.model('Person', personSchema);


if(name && number) {
	const newPerson = new Person({ name, number });

	newPerson.save().then(() => {
		mongoose.connection.close();
	});
} else {
	Person.find({}).then(persons => {
		console.log('phonebook');
		persons.forEach(p => console.log(`${p.name} ${p.number}`));

		mongoose.connection.close();
	});




}

