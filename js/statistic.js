'use strict'

export function statisticAdd(obj) {
    // obj = { mode: '', winner: '' }
    let count = localStorage.getItem('count');
    if (!count) {
        localStorage.setItem('count', 0);
        count = 0;
    }

    let stats = JSON.parse( localStorage.getItem('stats') );
    if (stats == undefined) {
        stats = [ {id: ++count, mode: obj.mode, winner: obj.winner, date: calcDate()} ];
    } else {
        stats.push({id: ++count, mode: obj.mode, winner: obj.winner, date: calcDate()});
    }
    localStorage.setItem('count', count);
    localStorage.setItem('stats', JSON.stringify(stats));

    return stats;

    function calcDate() {
        let now = new Date();
        let year = now.getFullYear(),
            month = now.getMonth()+1,
            day = now.getDate(),
            hour = now.getHours(),
            minute = now.getMinutes();
        if (minute < 10) minute = '0'+minute;
        if (hour < 10) hour = '0'+hour;

        return `${day}.${month}.${year} ${hour}:${minute}`;
    }
    
    
}

export function statisticUpdate() {
    let tbody = document.querySelector('#statTable tbody');

    let stats = localStorage.getItem('stats');
     
    if (!stats) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">Записей пока нет.</td></tr>`;
    } else {
        stats = JSON.parse(stats);
        tbody.innerHTML = '';
        for (let item of stats) {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <th scope="row">${item.id}</th>
                <td>${item.mode}</td>
                <td>${item.winner}</td>
                <td>${item.date}</td>`;
            tbody.appendChild(tr);
        }
    }
}