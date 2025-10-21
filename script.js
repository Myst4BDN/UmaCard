
// variables
let cards = [];
let cards_loaded = false;


// load cards
function load_cards() {
    return fetch('cards.json')
        .then(response => response.json())
        .then(json => {
            cards = json;
        });
}
// sort by type
function sort_cards(){
    if(!cards_loaded) return;

    let return_list = [];
    
    let types = ["speed", "stamina", "power", "guts", "wit", "pal"];

    types.forEach(type => {
        cards.forEach(card =>{
            if(card.type.toLowerCase() == type)
                    return_list.push(card);
        })
    })
    
    cards = [...return_list];
}

// load cards, and initialize things
load_cards().then(() => {
    cards_loaded = true; 

    sort_cards();
    update_search_results('');
    update_selected_cards();
});

// for comparing later
function get_rating(id, lb){
    let total = 0;

    let card = cards.find(_card => _card.id == id && _card.lb == lb);

    total += get_stat(card, "friendship_bonus"        ) * 1.2
    total += get_stat(card, "mood_effect"             ) * 0.3
    total += get_stat(card, "training_effectiveness"  ) * 3
    total += get_stat(card, "specialty_priority"      ) * 1.2
    total += get_stat(card, "initial_friendship_gauge") * 1.3

    total += get_stat(card, "speed_bonus"             ) * 5.0
    total += get_stat(card, "stamina_bonus"           ) * 5.0
    total += get_stat(card, "power_bonus"             ) * 5.0
    total += get_stat(card, "guts_bonus"              ) * 1.0
    total += get_stat(card, "wit_bonus"               ) * 1.0
    
    total += get_stat(card, "initial_speed"           ) * 0.5
    total += get_stat(card, "initial_stamina"         ) * 0.5
    total += get_stat(card, "initial_power"           ) * 0.5
    total += get_stat(card, "initial_guts"            ) * 0.25
    total += get_stat(card, "initial_wit"             ) * 0.25
    
    total += get_stat(card, "race_bonus"              ) * 2.5
    total += get_stat(card, "fan_bonus"               ) * 0.5
    total += get_stat(card, "hint_levels"             ) * 2.0
    total += get_stat(card, "hint_frequency"          ) * 0.25

    total += get_stat(card, "event_recovery"          ) * 1.0
    total += get_stat(card, "event_effectiveness"     ) * 1.0
    total += get_stat(card, "failure_protection"      ) * 1.0
    total += get_stat(card, "energy_cost_reduction"   ) * 1.0
    
    total += get_stat(card, "wit_friendship_recovery" ) * 1.0

    return Math.round(total);
}

function get_stat(card, stat){
    if(stat in card)
        return card[stat];
    return 0;
}





let selected_cards = [];
// init selected card elements
const selected_div = document.getElementById("selected_container");

// selected cards
function select_card(_id, _lb, _type){
    selected_cards.push({
        id: _id,
        lb: _lb,
        type: _type
    });
}
function update_selected_cards(){
    if(!cards_loaded) return;
    
    selected_container.innerHTML = '';
    
    selected_cards.forEach((card, i) => {
        // create card
        const card_cont = document.createElement('div');
        const card_img  = document.createElement('img');
        const card_type = document.createElement('img');

        card_cont.classList.add('card_container');

        card_img.src  = "./resources/Cards/(" + card.id + ").png";
        card_type.src = "./resources/Card_Types/" + card.type.toLowerCase() + ".png";
        
        card_img .classList.add("card_img");
        card_type.classList.add("card_type");

        card_cont.append(card_img, card_type);

        // create lb selector
        const lb_select = document.createElement('select');
        lb_select.classList.add("lb_selector");

        const lb0 = new Option("LB 0", "0");
        const lb1 = new Option("LB 1", "1");
        const lb2 = new Option("LB 2", "2");
        const lb3 = new Option("LB 3", "3");
        const lb4 = new Option("LB 4", "4");

        lb_select.append(lb0, lb1, lb2, lb3, lb4);

        lb_select.value = card.lb;
        lb_select.addEventListener('change', (event) => {
            card.lb = parseInt(event.target.value);
            update_selected_cards();
        })

        

        // create card total rating
        const rating = document.createElement('p');
        rating.classList.add('card_rating');

        rating.innerHTML = get_rating(card.id, card.lb);

        //remove button
        const remove_div = document.createElement('div');
        remove_div.classList.add('remove_selected_card');

        remove_div.innerHTML = 'x'

        remove_div.addEventListener('click', () => {
            selected_cards.splice(i, 1);
            update_selected_cards();
        })

        // create main container
        const main_div = document.createElement('div');    
        main_div.classList.add('selected_card');

        main_div.append(card_cont, lb_select, rating, remove_div);
        selected_div.appendChild(main_div);
    })
}



// init search elements
const search_field = document.getElementById('card_search_field');
const results_div  = document.getElementById('card_search_results');

// on search
search_field.addEventListener('input', ()=>{
    const query = search_field.value.toLowerCase();
    update_search_results(query);

});

// add results
function update_search_results(query){
       if(!cards_loaded) return;

    // Clear results HTML
    results_div.innerHTML = "";

    const filtered = cards.filter(item => item.name.toLowerCase().includes(query));

    let added = [];

    filtered.forEach(item =>{

        // if not already added
        if(!added.includes(item.id) && item.id >= 0){
            // add to list
            added.push(item.id);

            const div  = document.createElement('div');
            const img  = document.createElement('img');
            const type = document.createElement('img');

            img. src = "./resources/Cards/(" + item.id + ").png";
            type.src = "./resources/Card_Types/" + item.type.toLowerCase() + ".png";

            div. classList.add('card_container');
            img. classList.add('card_img');
            type.classList.add('card_type');

            div.appendChild(img);
            div.appendChild(type);

            results_div.appendChild(div);

            div.addEventListener('click', () =>{
                select_card(item.id, 0, item.type);
                update_selected_cards();
            });
        }
    });
}

