let contacts = [
    {
        id:1, firstName:'Beverly', lastName:'Malamba', email:'bevmalamba@gmail.com', phone:'+243820054610', fonction:'dev', entreprise:'kadea', 
    },
]

// const labels = ['Famille', 'Amis', 'Travail'];

function addContact(id, firstName, lastName, email) {
    contacts.push({id:id,
        firstName:firstName,
        lastName:lastName,
        email:email
    });
}