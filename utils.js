const DataModel = require('./dist/models/DataModel');
const mongoose = require('mongoose');
const converter = require('json-2-csv');

const sendAttachment = function(transporter, mailOptions) {
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Message sent: " + info.response);
        }
    });      
};

const sendCSV = function(transporter, mailOptions, CSVOptions) {
    DataModel.find({}).lean().exec(function(err, data) {
        const now = new Date().toString().split(' ').slice(0,5).join(' ');
        mailOptions.subject = 'CSV Data for ' + now;            
        const CSVString = converter.json2csv(data, function(err, csv) {
            mailOptions.attachments = [{
                'filename': now + '-CSV.txt',
                'content': csv
            }];
            // send e-mail
            sendAttachment(transporter, mailOptions);
        }, CSVOptions);
    });
};

const sendBoth = function(transporter, mailOptions, CSVOptions) {
    DataModel.find({}).lean().exec(function(err, data) {
        const now = new Date().toString().split(' ').slice(0,5).join(' ');
        mailOptions.subject = 'CSV and JSON Data for ' + now;            
            const CSVString = converter.json2csv(data, function(err, csv) {
                const JSONString = JSON.stringify(data);
                mailOptions.attachments = [{
                    'filename': now + '-CSV.txt',
                    'content': csv
                },
                {
                    'filename': now + '-JSON.txt',
                    'content': JSONString
                }];
                // send e-mail
                sendAttachment(transporter, mailOptions);
            }, CSVOptions);  
    });
};

const sendJSON = function(transporter, mailOptions) {
    DataModel.find({}).lean().exec(function(err, data) {
        const now = new Date().toString().split(' ').slice(0,5).join(' ');
        mailOptions.subject = 'JSON Data for ' + now;            
        const JSONString = JSON.stringify(data);
            mailOptions.attachments = [{
                'filename': now + '-JSON.txt',
                'content': JSONString
            }];
        sendAttachment(transporter, mailOptions);
    });
};

const pastRange = function(range) {
    const nowMilli = Date.now();
    const now = new Date(nowMilli).toISOString();
    const before = new Date(nowMilli - range).toISOString();
    return { $gt: before, $lte: now };
};

module.exports = {
    past: pastRange,
    sendAttachment: sendAttachment,
    sendCSV: sendCSV,
    sendJSON: sendJSON,
    sendBoth: sendBoth
};
