const data = [];
const daysInJanuary = 10;

for (let day = 1; day <= daysInJanuary; day++) {
    const randomUv = Math.floor(Math.random() * 100); 
    const randomPv = Math.floor(Math.random() * 100); 
    const randomAmt = Math.floor(Math.random() * 5000); 


    const entry = {
        name: `${day}`,
        sales: randomUv ,
        customers: randomPv ,
        amt: randomAmt ,
    };

    data.push(entry);
}

export default data;
