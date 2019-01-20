importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context.roomsexample.events);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context.roomsexample.schema);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context.roomsexample.schema.devices);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context.roomsexample.schema.rooms);

CTX.subscribe("DetectMotionStartInRooms","Room",function (room) {
    bp.sync({ waitFor:MotionDetectedEvent(room.getMotionDetector()) });
    bp.sync({ request:CTX.UpdateEvent("Room_markRoomAsNonEmpty", {room: room}) });
});
CTX.subscribe("DetectMotionStopInRooms","Room",function (r) {
    bp.sync({ waitFor:MotionStoppedEvent(r.getMotionDetector()) });
    bp.sync({ request:CTX.UpdateEvent("Room_markRoomAsEmpty", {room: r}) });
});

CTX.subscribe("DelayRoomAsEmpty","Room",function (r) {
    // var numberOfTicks = 60 * 3;
    var numberOfTicks = 5;
    var motionDetectedEvent = MotionDetectedEvent(r.getMotionDetector());
    var i = 0;
    while(true) {
        bp.sync({waitFor: MotionStoppedEvent(r.getMotionDetector())});
        bp.registerBThread("DelayRoomAsEmptyHelper_"+(i++), function() {
            var e = bp.sync({
                waitFor: CTX.AnyTickEvent(),
                block: CTX.UpdateEvent("Room_markRoomAsEmpty", {room: r}),
                interrupt: motionDetectedEvent,
            });
            bp.sync({
                waitFor: CTX.TickEvent(e.tick + numberOfTicks),
                block: CTX.UpdateEvent("Room_markRoomAsEmpty", {room: r}),
                interrupt: motionDetectedEvent,
            });
        });
    }
});

CTX.subscribe("TurnLightsOnInNonemptyRooms","Nonempty Room",function (room) {
    bp.sync({
        request:TurnLightOnEvent(room.getSmartLight()),
        interrupt: CTX.ContextEndedEvent("Nonempty Room", room)
    });
});
CTX.subscribe("TurnLightsOffInEmptyRooms","Room",function (room) {
    bp.sync({ request:TurnLightOffEvent(room.getSmartLight()) });
});

CTX.subscribe("OfficeBehaviors","Office",function (o) {
    CTX.subscribe("TurnACOnInNonemptyOffices","Nonempty Room",function (r) {
        if(o === r) {
            bp.sync({ request:TurnACOnEvent(r.getAirConditioner()) });
        }
    });
    CTX.subscribe("TurnACOffInEmptyOffices","Room",function (r) {
        if(o === r) {
            bp.sync({ request:TurnACOffEvent(r.getAirConditioner()) });
        }
    });
});


/*CTX.subscribe("TurnACOnInNonemptyOffices","Nonempty Room",function (r) {
    // TODO: need to check this!
    if(r isinstanceof Office)
    bp.sync({ request:TurnACOnEvent(r.getAirConditioner()) });
});
CTX.subscribe("TurnACOffInEmptyOffices","Room",function (r) {
    // TODO: need to check this!
    if(r isinstanceof Office)
    bp.sync({ request:TurnACOffEvent(r.getAirConditioner()) });
});*/

CTX.subscribe("DisableLightsOffDuringAnEmergency","Emergency",function (e) {
    CTX.subscribe("DisableLightsOffDuringAnEmergency.Room","Room",function (r) {
        bp.sync({block: AnyTurnLightOffEvent(),
        interrupt:CTX.ContextEndedEvent("Emergency",e)});
    });
});