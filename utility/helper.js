export const addTotal = (cardData) => {
    return Object.values(cardData.content.score).reduce(
        (acc, current) => parseInt(current) + parseInt(acc)
    );
};

export const addFront = (cardData) => {
    const values = Object.entries(cardData.content.score);
    let total = 0;
    values.forEach((val) => {
        const hole = val[0].replace('hole', '');
        if (hole <= 9) {
            total += parseInt(val[1]);
        }
    });
    return total;
};

export const addBack = (cardData) => {
    const values = Object.entries(cardData.content.score);
    let total = 0;
    values.forEach((val) => {
        const hole = val[0].replace('hole', '');
        if (hole >= 10) {
            total += parseInt(val[1]);
        }
    });
    return total;
};
