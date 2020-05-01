var notifier = require('node-notifier')

function notify(title, message, sound, wait, callback_on_click, callback_on_wait){
    notifier.notify({
        title: title,
        message: message,
        icon: "./static/logos/logo.png",
        sound: sound,
        wait: wait
    },function (err, resp){});

    notifier.on("activate", function(ntfObj, opt){
        if(typeof(callback_on_click)==="function"){
            callback_on_click(ntfObj, opt);
        }
    });
    notifier.on("timeout", function(ntfObj, opt){
        if(typeof(callback_on_wait)==="function"){
            callback_on_wait(ntfObj, opt);
        }
    });
}

exports.notify = notify;