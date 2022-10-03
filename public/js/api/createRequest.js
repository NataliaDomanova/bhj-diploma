/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let url = options.url;
    const formData = new FormData();

    if(options.data) {
        if(options.method === 'GET') {           
               url += '?' + Object.entries(options.data).map(
                   ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
               ).join('&');
           } else {
            Object.entries(options.data).forEach(v => formData.append(...v));
           }
    }
    
    if(options.callback) {
        //xhr.onerror = () => {}
        xhr.onload = () => {
            let resp = null;
            let err = null; 
            const r = xhr.response;

            try {
                if(r && r.success) {
                    resp = r;
                } else {
                    err = r;
                }
            } catch(e) {
                err = e;
            }

            options.callback(err, resp);
            }                
        };       
    
    xhr.open(options.method, url);
    xhr.send(formData);
};
