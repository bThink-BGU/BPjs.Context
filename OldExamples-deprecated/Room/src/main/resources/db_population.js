/*bp.registerBThread("PopulateDB", function() {
    var achiya = new Worker(000000001, "Achiya Elyasaf");
    var gera = new Worker(000000002, "Gera Weiss");
    var arnon = new Worker(000000003, "Arnon Sturm");

    var building96 = new Building("96");
    var office96_224 = new Office("224", building96, achiya);
    var office96_225 = new Office("225", building96, arnon);
    var kitchen96_252 = new Kitchen("252", building96);

    var building37 = new Building("37");
    var office37_123 = new Office("123", building37, gera);

    bp.sync({ request: bp.Event("CTX.Insert",[
            achiya,gera,arnon,
            building37, office37_123,
            building96, office96_224, office96_225, kitchen96_252
        ]) });
});*/

bp.registerBThread("PopulateDB", function() {
    let office96_224 = new Office("224");
    let office96_225 = new Office("225");
    let kitchen96_252 = new Kitchen("252");

    bp.sync({ request: bp.Event("CTX.Insert",[
            System(4), office96_224, office96_225, kitchen96_252
        ]) });
});