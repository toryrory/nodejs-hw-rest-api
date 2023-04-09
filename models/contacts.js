// const fs = require('fs/promises');
// const path = require('path');
// const { uid } = require('uid');

// const contactsPath = path.join(__dirname, 'contacts.json');

// const listContacts = async () => {
// try {
//     const contacts = await JSON.parse(await fs.readFile(contactsPath, "utf8"));
// return contacts
// } catch (error) {
//   console.log(error);
// }
// }

// const getContactById = async (contactId) => {
//   try {
//     const contacts = await listContacts();
//     const contactById = contacts.find(({ id }) => id === contactId);
//     return contactById || null;
//   } catch (err) {
//     console.log(err);
//   }
// }

// const removeContact = async (contactId) => {
//   try {
//     const contacts = await listContacts();
//     const contactToDelete = await getContactById(contactId);
//     if (!contactToDelete) {
//       console.log(`Contact with id "${contactId}" do not exist!`);
//       return;
//     }
//     const newContacts = await contacts.filter(({ id }) => id !== contactId);
//     await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
//     console.log(`Contact with id "${contactId}" successfully deleted!`);
//     return contactToDelete;
//   } catch (err) {
//     console.log(err);
//   }
// }

// const addContact = async (body) => {
//   try {
//     const { name, email, phone } = body;
//     const contacts = await listContacts();
//     const newContact = {
//       id: uid(21),
//       name: name,
//       email: email,
//       phone: phone,
//     };
//     contacts.push(newContact);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     console.log(`New contact "${newContact.name}" successfully added!`);
//     return newContact;
//   } catch (err) {
//     console.log(err);
//   }
// }

// const updateContact = async (contactId, body) => {
//   try {
    
//     const contacts = await listContacts();
//     const contactToUpdate = await getContactById(contactId);

//     const contactIdx = contacts.findIndex((item) => item.id === contactId);
  
//     if (contactToUpdate === null || contactId === -1) {
//       return null;
//     }
//     contacts[contactIdx] = {...contactToUpdate, ...body };
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return contacts[contactIdx];
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }
