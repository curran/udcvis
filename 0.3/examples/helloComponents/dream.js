// *-------*
// |  Map  |
// *-------*
// | Time  |
// *-------*
var data = load('UNPopulationEstimates'),
    map = new ChoroplethMap(data),
    time = new LineChart(data)
    dashboard = vbox([map, time]);

connect(map.out.visibleRegions, time.spaceSlice);

connect(time.centerTime, map.timeSlice);

connect(map.probe, globalProbe);
connect(time.probe, globalProbe);

connect(map.selection, globalSelection);
connect(time.selection, globalSelection);
