'use strict'

export function shot(_id, _field) {
    const target = document.getElementById(_id);

    let coords = _id.match(/x\d{1,}|y\d{1,}/g);
    coords = coords.map(item => item.slice(1));

    console.log(coords);

}