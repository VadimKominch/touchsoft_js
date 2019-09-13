function debounce(f, miliseconds) {
    let time = null;
    return function (arguments) {
        function bindContext(){
            f.apply(this, arguments);
            time = null;
        }


        if (time) {
            clearTimeout(time);
        }

        time = setTimeout(bindContext,miliseconds);
    };
}