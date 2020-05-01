<h1>Implemented chat features</h1>
<button onclick="action();" class="btn btn-primary">Click here to trigger a notification!</button>

<script>
      var notifier = require('./../notifications.js')
      function action(){
         notifier.notify("Test", "This is a test", true, false, log)
      }
      function log(a, b){
         console.log(a, b)
      }
</script>