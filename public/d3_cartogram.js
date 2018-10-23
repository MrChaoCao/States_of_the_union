const mapSocket = io.connect('/');

const state_map_array =
[
  NaN, 0.00, 0.00,  NaN, 0.00, 0.00, 0.00,  NaN, 0.00, 0.00,
  0.00,  NaN, 0.00, 0.00,  NaN, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00,  NaN, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00,  NaN, 0.00, 0.00, 0.00, 0.00
];

const colors = [
  "red",
  "orange",
  "yellow",
  "blue",
  "green",
  "indigo",
  "violet",
]

const states = new Object()
  states.AL = 1;
  states.AK = 2;
  states.AZ = 4;
  states.AR = 5;
  states.CA = 6;
  states.CO = 8;
  states.CT = 9;
  states.DE = 10;
  states.FL = 12;
  states.GA = 13;
  states.HI = 15;
  states.ID = 16;
  states.IL = 17;
  states.IN = 18;
  states.IA = 19;
  states.KS = 20;
  states.KY = 21;
  states.LA = 22;
  states.ME = 23;
  states.MD = 24;
  states.MA = 25;
  states.MI = 26;
  states.MN = 27;
  states.MS = 28;
  states.MO = 29;
  states.MT = 30;
  states.NE = 31;
  states.NV = 32;
  states.NH = 33;
  states.NJ = 34;
  states.NM = 35;
  states.NY = 36;
  states.NC = 37;
  states.ND = 38;
  states.OH = 39;
  states.OK = 40;
  states.OR = 41;
  states.PA = 42;
  states.RI = 44;
  states.SC = 45;
  states.SD = 46;
  states.TN = 47;
  states.TX = 48;
  states.UT = 49;
  states.VT = 50;
  states.VA = 51;
  states.WA = 53;
  states.WV = 54;
  states.WI = 55;
  states.WY = 56;

let countryMap;
d3.json("/map", function(error, america){
  countryMap = america
})

document.addEventListener('DOMContentLoaded', () => {
  renderMap();
});

mapSocket.on('tweetBody', (tweet) => {
  state_map_array[states[tweet.state]] += 0.005;
  clearMap();
  renderStates();
});

function clearMap() {
  d3.selectAll(".state").remove();
}

function renderStates(){
  let path = d3.geo.path();
  let svg = d3.select("svg")

  if (countryMap){
    svg.selectAll(".state")
      .data(topojson.feature(countryMap, countryMap.objects.states).features)
      .enter().append("path")
      .attr("class", "state")
      .attr("d", path)
      .attr("transform", function(d) {
        let centroid = path.centroid(d);
        let x = centroid[0];
        let y = centroid[1];

        if (x && y){
          return "translate(" + x + "," + y + ")"
            + "scale(" + Math.sqrt(state_map_array[d.id] * 5 || 0) + ")"
            + "translate(" + -x + "," + -y + ")";
          // return `translate(${x}, ${y})"`
          // + `scale(${Math.sqrt(state_map_array[d.id] * 5 || 0)})`
          // + `translate(${-x}, ${-y})`
        }
      })
      .style("stroke-width", function(d) {
        return 1 / Math.sqrt(state_map_array[d.id] * 5 || 1);
      })
      .style("fill", function(d){
        return colors[d.id % 7]
    });
  }
}

function renderMap(){
  let path = d3.geo.path();
  let svg = d3.select(".map-div").append("svg")
      .attr("width", 960)
      .attr("height", 500)
  d3.json("/map", function(error, countryMap) {
    if (error) throw error;
    svg.append("path")
        .datum(topojson.feature(countryMap, countryMap.objects.land))
        .attr("class", "land")
        .attr("d", path);
  });
}
