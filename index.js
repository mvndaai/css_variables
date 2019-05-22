(function() {
    const target = document.querySelector('#variable_list');

    // Persistence for keeping a theme after reaload

    const persistStorageKey = 'theme';
    const persistCheckboxKey = 'shouldPersist'
    let shouldPersist = JSON.parse(localStorage.getItem(persistCheckboxKey));

    function persistChange(key, value) {
        if (!shouldPersist) return;
        const theme = JSON.parse(localStorage.getItem(persistStorageKey)) || {};
        theme[key] = value;
        localStorage.setItem(persistStorageKey, JSON.stringify(theme));
    }
    function getPersisted(key) {
        const theme = JSON.parse(localStorage.getItem(persistStorageKey)) || {};
        return theme[key];
    }

    (function setPersisted(){
        const theme = JSON.parse(localStorage.getItem(persistStorageKey)) || {};
        Object.keys(theme).forEach(key => {
            document.documentElement.style.setProperty(key, theme[key]);
        })
    })();

    (function persistElement(){
        const div = document.createElement('div')
        div.classList.add('persist_box');

        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('id', 'persist')
        checkbox.checked = shouldPersist;
        checkbox.onchange = (e) => {
            localStorage.setItem(persistCheckboxKey, JSON.stringify(e.target.checked));
            shouldPersist = e.target.checked
        };

        const label = document.createElement('label')
        label.setAttribute('for', 'persist')
        label.innerText = "Persist changes"

        const clear = document.createElement('button')
        clear.innerText = 'clear storage';
        clear.onclick = () => {
            delete localStorage[persistStorageKey];
            delete localStorage[persistCheckboxKey];
        };

        div.appendChild(checkbox);
        div.appendChild(label)
        div.appendChild(clear)

        target.appendChild(div);
    })()

    // Get css variables from stylesheets

    function getVariables() {
        return [].slice.call(document.styleSheets)
            .map(styleSheet => [].slice.call(styleSheet.cssRules)).flat()
            .filter(cssRule => cssRule.selectorText === ':root')
            .map(cssRule => cssRule.cssText.split('{')[1].split('}')[0].trim().split(';'))
            .flat().filter(text => text !== "")
            .map(text => text.split(':'))
            .map(parts => ({ key: parts[0].trim(), value: getPersisted(parts[0].trim()) || parts[1].trim() }) );
        ;
    }

    // Create the inputs to change variables
    getVariables().forEach(v => {
        const div = document.createElement('div');
        div.classList.add('var_box');

        const text = document.createTextNode(v.key);

        const input = document.createElement('input');
        input.setAttribute('name', 'in');
        input.value = v.value;
        input.oninput = (e) => {
            document.documentElement.style.setProperty(v.key, e.target.value);
            persistChange(v.key, e.target.value);
        }

        div.appendChild(text);
        div.appendChild(input);

        target.appendChild(div);
    });

})()
