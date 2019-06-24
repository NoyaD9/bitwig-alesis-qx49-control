loadAPI(2);
host.setShouldFailOnDeprecatedUse(true);

host.defineController("Alesis", "QX49", "1.0", "6E55D132-1846-4C64-9F97-48041F2D9B96");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["QX49"], ["QX49"]);

var LOWEST_CC = 1;
var HIGHEST_CC = 113;
var STOP_CC = 118;
var PLAY_CC = 119;
var RECORD_CC = 114;
var FAST_FORWARD_CC = 117;
var REWIND_CC = 118;
var LOOP_CC = 115;

function init() {
   host.getMidiInPort(0).setMidiCallback(onMidi);
   generic = host.getMidiInPort(0).createNoteInput("", "??????");
   generic.setShouldConsumeEvents(false);

   transport = host.createTransport();

   userControls = host.createUserControls(HIGHEST_CC - LOWEST_CC + 1);

   for(var i=LOWEST_CC; i<=HIGHEST_CC; i++) {
      userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
   }
}

function onMidi(status, data1, data2) {
   //uncomment the following line to print the data in the Script Console
   //println("data1 "+ data1 + " data2 " + data2);
   if (isChannelController(status)) {
      if(data1>= STOP_CC && data1 <= LOOP_CC){
         handleTransportCC(data1, data2);
      }else if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC) {
         var index = data1 - LOWEST_CC;
         userControls.getControl(index).set(data2, 128);
      }
   }
}

function handleTransportCC(data1, data2){
   //we want to change the state only when we press the button (max velocity), not when we release it (velocity 0)
   if(data2 == 127){
      switch (data1){
         case STOP_CC :
            transport.stop();
            break;
         case PLAY_CC:
            transport.play();
            break;
         case RECORD_CC:
            transport.record();
            break;
         case FAST_FORWARD_CC:
            transport.fastForward();
            break;
         case REWIND_CC:
            transport.rewind();
            break;
         case LOOP_CC:
            transport.isArrangerLoopEnabled().toggle()
            break;
      }
   }
}

function exit()
{
}
