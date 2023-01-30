const { io } = require('../index');
const Bands = require('../models/bands')
const Band = require('../models/band')

const bands = new Bands();
console.log('init server')

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Korn'));

console.log(bands)

// Socket Messages 
io.on('connection', client => {
    console.log('Client Connected');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Client Disconnected')
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('add-band', (payload) => {
       newBand= new Band(payload.name);
        bands.addBand(newBand);       
        io.emit('active-bands',bands.getBands());
    });

    client.on('emitir-mensaje', (payload) => {
        console.log(payload);
        client.broadcast.emit('nuevo-mensaje', payload);
    });
});