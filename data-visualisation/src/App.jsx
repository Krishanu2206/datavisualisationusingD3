import React, { useState, useEffect } from 'react';
import './App.css';
import HorizontalBarChartIntensityBySector from './HorizontalBarChartIntensityBySector';
import PieChartOfRelevanceAndSector from './PieChartOfRelevanceAndSector';
import LikelihoodPieChart from './LikelihoodPiechart';
import BarChartLikelihoodByRegion from './BarChartLikelihoodByRegion';
import HorizontalBarChartRelevanceBySector from './HorizontalBarChartRelevanceBySector';
import HorizontalBarChartRegionOnTopic from './HorizontalBarChartRegionOnTopic';
import HorizontalBarChartCountryTopic from './HorizontalBarChartCountryTopic';
import HorizontalBarChartYearTopic from './HorizontalBarChartYearTopic';
import VerticalBarChartRelevanceByTopic from './VerticalBarChartRelevanceByTopic';
import PieChartOfRelevanceAndtopic from './PieChartOfTopicByRelevance';
import HorizontalBarChartRelevanceBypestle from './HorizontalBarChartPestleByRelevance';
import HorizontalBarChartRegionpestle from './HorizontalBarChartRegionByPestle';
import PieChartOfTopicWiseCountry from './PieChartOfTopicwiseCountry';
import PieChartOfsectorWiseregion from './PieChartOfRegionWiseSector';
import PieChartOfpestleWiseregion from './PieChartOfPestleWiseRegion';
import HorizontalBarChartEndYearTopic from './HorizontalBarChartEndYearTopic';
import LineChartIntensityByYear from './LineChartIntensityByYear';
import LineChartRelevanceByYear from './LineChartRelevanceByYear';
import PieChartOfSourceWiseTopic from './PieChartOfSourceAndTopic';
import TreeDiagram from './TreeMap';
import TreeDiagram2 from './TreeMap2';
import PieChartRegionWiseSectoronRelevance from './PieChartRegionWiseSectoronRelevance';
import PieChartCountryWiseSectoronRelevance from './PieChartCountryWiseSectoronRelevance';

function App() {
  const [data, setData] = useState([]);
  const [selectedtopic, setSelectedtopic] = useState("oil"); // Initial selected topic
  const [selectedsector, setSelectedsector] = useState("Information Technology"); // Initial selected sector
  const [selectedpestle, setSelectedpestle] = useState("Organization");
  const [selectedsource, setSelectedsource] = useState("EIA");
  const [selectedregion, setSelectedregion] = useState("Northern America");
  const [selectedcountry, setSelectedcountry] = useState("United States of America");

  const topicOptions = ["gas", "oil", "consumption", "market", "gdp", "war", "production", "export", "battery", "biofuel", "policy", "economy", "strategy", "robot", "growth", "economic", "energy", "food", "administration", "unemployment", "trade", "demand", "economic growth", "industry", "capital", "worker", "tension", "terrorism", "transport", "peak oil", "vehicle", "tourist", "artificial intelligence", "climate", "power", "crisis", "ice", "population", "politics", "business", "work", "coal", "gamification", "finance", "interest rate", "risk", "inflation", "asylum", "resource", "plastic", "electricity", "bank", "gasoline", "car", "money", "technology", "aquaculture", "city", "investment", "revenue", "emission", "climate change", "infrastructure", "government", "security", "software", "building", "transportation", "wealth", "clothing", "shortage", "debt", "agriculture", "tax", "carbon", "brexit", "workforce", "change", "automaker", "nuclear", "3D", "water", "data", "fossil fuel", "election", "greenhouse gas", "information", "shale gas", "factory", "farm", "communication", "storm", "consumer", "material", "Washington", "pollution", "fracking"];

  const sectorOptions = ["Energy", "Environment", "Government", "Aerospace & defence", "Manufacturing", "Retail", "Financial services", "Support services", "Information Technology", "Healthcare", "Food & agriculture", "Automotive", "Tourism & hospitality", "Construction", "Security", "Transport", "Water", "Media & entertainment"];

  const pestleOptions =  ["Industries", "Environmental", "Economic", "Political", "Technological", "Organization", "Healthcare", "Social", "Lifestyles"];

  const sourceoptions = ["EIA", "sustainablebrands.com", "SBWire", "CleanTechnica", "TRAC News", "Vanguard News", "Avi Melamed", "WSJ", "Abq", "Reuters", "Star Tribune", "EV Obsession", "creamermedia", "Resilience", "TheNews.NG", "FashionNetwork.com", "Bloomberg Business", "Yes Bank", "EGYPS", "marketrealist", "PDQFX news", "therobotreport", "nextbigfuture", "World Bank", "Zero Hedge", "Rigzone", "International Business Times", "DOE EIA 2013 Energy Conference", "AllAfrica", "Energy.gov Website", "AMERICAN COUNCIL ON SCIENCE AND HEALTH", "The Jakarta Post", "Wharton", "African Arguments", "Business Insider", "Convenience Store Decisions", "The Next Web", "Cii Radio", "Global Money Trends", "Guardian Sustainable Business", "OklahomaMinerals.com", "4th Annual Congress and Expo on Biofuels and Bioenergy April 27-28 2017 Dubai UAE", "FX Empire", "Nexus Conference", "Fews Net", "Sputnik News", "platts", "CBO", "The Chirographer", "Yahoo Finance Canada", "Gii Research", "South Sudan News Agency", "Climate Change News", "the star online", "khorreports-palmoil", "Canadian Biomass", "Informed Choice Chartered Financial Planners in Cranleigh", "Guarini Center", "OMFIF", "South World", "World Energy News", "Slinking Toward Retirement", "unian", "Scientific American", "Time", "Transport Environment", "Triple Pundit", "Transport Evolved", "Fox Business", "The Independent", "Biofuels Digest", "IRENA newsroom", "Nation of Change", "Middle East Eye", "IEA", "Gas 2", "Peak Prosperity", "Business Wire", "RiskMap 2017", "MRC", "Insurance Journal", "Wired UK", "Technavio", "News", "Media Center ", "EY", "Tactical Investor", "Seeking Alpha", "iMFdirect - The IMF Blog", "oilprice.com", "Eurasia Group", "NY Times", "Imeche", "University of Chicago", "Adam Curry", "JD Supra", "UK Government", "Investopedia", "Vox", "South China Morning Post", "OEM/Lube News", "PR Newswire", "Future Market Insights", "Manufacturing Operations Technology Viewpoints", "CSIS", "Edge and Odds", "maltawinds.com", "iamericas", "cpzulia", "farms", "IFT", "International Banker", "bankofcanada", "Koenig Investment Advisory", "Europa", "Jachin Capital", "Wells Fargo", "ethicalconsumer", "Citibank", "Cornell University", "arabellaadvisors", "Critical Threats", "Fitch", "prsync", "Physics World", "Renewable Energy World", "BBC News Technology", "edie.net", "Russia Beyond The Headlines", "Politico", "Tech Times", "Wood McKenzie", "3D Printing Progress", "ihsmarkit", "Gizmodo Australia", "The Nation", "Farms.com", "McKinsey & Company", "The Guardian", "Resources for the Future", "satprnews", "GreenBiz", "CNBC ", "Sydney Morning Herald", "www.narendramodi.in", "CNNMoney", "EIU", "Euromoney", "gasstrategies", "Cars.co.za", "dpaq", "europeanclimate", "Australian Government", "TeleTrade", "Bloomberg New Energy Finance", "The Economist", "Phys Org", "djsresearch", "nbk", "Guardian", "cargill", "Worldly", "Utility Dive", "newscientist", "westpandi", "IASTOPPERS", "THISDAY LIVE", "veteranstoday", "thespanisheconomy", "biologicaldiversity", "portfolioticker", "MIT Technology Review", "FoodQualityNews.com", "The Conversation", "World Bank Group", "TheCable", "Future Earth", "Carbon Brief", "Wikipedia", "NWF", "USDA", "energyglobal", "IEA.org", "PwC", "metalprices", "GE Reports", "Project Syndicate", "Interior Design", "idc-community", "Science Daily", "The Mainichi", "economy", "Drill or drop?", "Huffington Post", "Lawfare", "Futureseek Link Digest", "Environmental Leader", "Business Standard", "ESPAS", "Euler Hermes", "amundi", "ebrd", "Drydock Magazine", "BorneoPost Online", "Finance Magnates", "friday-thinking", "Newsweek", "ECFR", "University of Latvia", "Future Timeline", "allianzglobalinvestors", "controleng", "inputsmonitor", "Planetsave ", "agriworldsa", "globalmoneytrends", "Oxfam", "Gartner", "clientadvisoryservices", "IMF", "Eco-Business.com", "Channel News Asia", "War on the Rocks", "biomassmagazine", "Think Progress", "No 2 Nuclear Power", "ogauthority", "IBEF", "Prospects for Development", "Engineering News", "NDTV", "African Development Bank", "Aljazeera.com", "worldenergy", "cloudfront", "Zawya", "FAO", "VOA", "Hospitality Trends", "saltlakecityheadlines", "The Ticker Tape", "The Globe and Mail", "AgWeb - The Home Page of Agriculture", "CAFrackFacts", "jeita", "murc", "Fast Co-Exist", "Cushman & Wakefield Blog", "Science News", "Quartz", "Total", "globalizationpartners", "Washington Post", "Inside Climate News", "polymerspaintcolourjournal", "njc-cnm", "IISS", "The Atlantic", "Innovations Report", "Nature", "Cushman & Wakefield", "Maplecroft", "Predictive Analytics Times", "McKinsey Quarterly", "Countries.com Global Content", "The Market Mogul", "knomad", "UNESCO ", "GlobalMeatNews.com", "Motor Magazine", "MENA-Forum", "Blue and Green Tomorrow", "valburyresearch", "HBR", "Nanotechnology Innovation", "oilvoice", "ecesr", "Freedonia", "ethicalmarkets", "Climate News Network", "OPEC", "INSEAD Knowledge", "CIO", "Institutional Investor", "Society of Motor Manufacturers and Traders (SMMT)", "worldculturepictorial", "globalfueleconomy", "LiveMint", "g7g20", "Mast", "ReadWrite", "LNG", "European Central Bank", "Industrial Control Security", "Verisk Maplecroft", "ETEnergyworld.com", "briandcolwell", "DW.COM", "Elsevier", "MAPI", "Days Of Year", "Virgin Atlantic", "Government of Ireland", "The Engineer", "ISA", "Energy Tomorrow", "Justmeans", "Khaleej Times", "Innovaro", "FutureinFocus", "What's Next", "Stanford News", "Middle East Online", "Neon Nettle", "Handelsblatt Global Edition", "EE News", "Before It's News | Alternative News | UFO | Beyond Science | True News| Prophecy News | People Powered News", "aswm", "Shenandoah", "Digitalist Magazine", "EPA", "Azonano", "National Geographic Society (blogs)", "IER", "Ocean Acidification", "Smart Grid Observer", "Freenewspos", "AHDB", "SlideShare", "VITA Technologies", "Wall Street Daily", "Bearnobull", "CCN: Financial Bitcoin & Cryptocurrency News", "IRENA", "International Monetary Fund (IMF)", "Arangkada Philippines", "Global Information Inc", "ID TECH INDEX", "The Jamestown Foundation", "savepassamaquoddybay", "atradius", "dailyquiddity", "bankofengland", "Futurity", "Business Green", "About Best Binary Options Strategy", "IHS Engineering 360", "European Council", "Activist Post", "Newsletter", "U.S. Environmental Protection Agency", "Global Money Trends Magazine", "CAJ News Africa", "Planetizen", "CDC", "Strategy & Formerly Booz & Company", "PriceWaterhouseCoopers", "News.com", "Brookings Institute", "Innovate UK", "The Arab Gulf States Institute Washington", "Embedded Computing Design", "European Environment Agency", "Industry Week", "Atlantic Council ", "U.K. Ministry of Defense", "Future in Focus", "Australian Government Department of Defence", "MIT Sloan Management Review", "Scania Group", "watercanada", "Common Dreams", "theicct", "nbp", "Thomson Reuters ", "University Chronicle", "globalr2p", "Robothub", "New Security Beat", "betterenergy", "Real Estate Professional", "Mind Commerce", "Yahoo Finance", "Pickens Plan", "RUSI", "Hardin Tibbs", "World Health", "environmentalpeacebuilding", "greenerearthnews", "conferenceseries", "dailytexanonline", "EPS News", "The American Prospect", "Face2face Africa", "Oil and Gas Journal", "Infracircle", "uschamber", "energy news cyprus", "UNEP", "Foreign Policy", "Europe in My Region"];

  const regionOptions = ["Northern America", "Central America", "World", "Western Africa", "Western Asia", "Eastern Europe", "Central Africa", "Northern Africa", "Southern Africa", "Southern Asia", "Central Asia", "Eastern Asia", "South America", "South-Eastern Asia", "Eastern Africa", "Europe", "Western Europe", "Northern Europe", "Southern Europe", "Oceania", "Africa", "Asia"];

  const countryoptions = ["United States of America", "Mexico", "Nigeria", "Lebanon", "Russia", "Saudi Arabia", "Angola", "Egypt", "South Africa", "India", "Ukraine", "Azerbaijan", "China", "Colombia", "Niger", "Libya", "Brazil", "Mali", "Indonesia", "Iraq", "Iran", "South Sudan", "Venezuela", "Burkina Faso", "Germany", "United Kingdom", "Kuwait", "Canada", "Argentina", "Japan", "Austria", "Spain", "Estonia", "Hungary", "Australia", "Morocco", "Greece", "Qatar", "Oman", "Liberia", "Denmark", "Malaysia", "Jordan", "Syria", "Ethiopia", "Norway", "Ghana", "Kazakhstan", "Pakistan", "Gabon", "United Arab Emirates", "Algeria", "Turkey", "Cyprus", "Belize", "Poland"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/data/getalldata");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Insights and Data Visualisations</h1>
      {data.length > 0 ? (
        <div className="charts-container">
          <div className="chart-row">
            <div className="chart"><LineChartIntensityByYear data={data} /></div>
            <div className="chart"><LineChartRelevanceByYear data={data} /></div>
          </div>
          <div className="chart-row">
            <div className="chart"><PieChartOfRelevanceAndSector data={data} /></div>
            <div className="chart"><LikelihoodPieChart data={data} /></div>
          </div>
          <div className="chart-row">
            <div className="chart"><PieChartOfRelevanceAndtopic data={data} /></div>
            <div className="chart"><BarChartLikelihoodByRegion data={data} /></div>
          </div>
          <div><TreeDiagram data={data} /></div>
          <div><TreeDiagram2 data={data} /></div>
          <div className="chart-row">
            <div className="chart"><HorizontalBarChartIntensityBySector data={data} /></div>
            <div className="chart"><HorizontalBarChartRelevanceBySector data={data} /></div>
          </div>
          <div className="chart-row">
            <div className="chart"><HorizontalBarChartCountryTopic data={data} /></div>
            <div className="chart"><HorizontalBarChartRegionpestle data={data} /></div>
          </div>
          <div className="chart-row">
            <div className="chart"><HorizontalBarChartRelevanceBypestle data={data} /></div>
          </div>

          <div className="filter-charts-container">
            <h2 className="center-heading">Filter Charts</h2>
            <br></br>
            <div className="chart-row">
              <div className="filter-chart">
                <div className="chart-filter">
                  <label htmlFor="topic-select">Select Topic: </label>
                  <select id="topic-select" value={selectedtopic} onChange={(e) => setSelectedtopic(e.target.value)}>
                    {topicOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart"><PieChartOfTopicWiseCountry data={data} selectedtopic={selectedtopic} /></div>
              </div>
              <div className="filter-chart">
                <div className="chart-filter">
                  <label htmlFor="sector-select">Select Sector: </label>
                  <select id="sector-select" value={selectedsector} onChange={(e) => setSelectedsector(e.target.value)}>
                    {sectorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart"><PieChartOfsectorWiseregion data={data} selectedsector={selectedsector} /></div>
              </div>
            </div>
            <div className="chart-row">
              <div className="filter-chart">
                <div className="chart-filter">
                  <label htmlFor="pestle-select">Select PESTLE: </label>
                  <select id="pestle-select" value={selectedpestle} onChange={(e) => setSelectedpestle(e.target.value)}>
                    {pestleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart"><PieChartOfpestleWiseregion data={data} selectedpestle={selectedpestle} /></div>
              </div>
              <div className="filter-chart">
                <div className="chart-filter">
                  <label htmlFor="source-select">Select SOURCE: </label>
                  <select id="source-select" value={selectedsource} onChange={(e) => setSelectedsource(e.target.value)}>
                    {sourceoptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart"><PieChartOfSourceWiseTopic data={data} selectedsource={selectedsource} /></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="filter-chart">
                <div className="chart-filter">
                  <label htmlFor="region-select">Select Region: </label>
                  <select id="region-select" value={selectedregion} onChange={(e) => setSelectedregion(e.target.value)}>
                    {regionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart"><PieChartRegionWiseSectoronRelevance data={data} selectedregion={selectedregion} /></div>
              </div>
              <div className="filter-chart">
                <div className="chart-filter">
                  <label htmlFor="country-select">Select Country: </label>
                  <select id="country-select" value={selectedcountry} onChange={(e) => setSelectedcountry(e.target.value)}>
                    {countryoptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart"><PieChartCountryWiseSectoronRelevance data={data} selectedcountry={selectedcountry} /></div>
              </div>
            </div>
          </div>

          <div className="other-charts-container">
            <h2 className="center-heading">Other Charts</h2>
            <div className="chart-fullwidth centered"><HorizontalBarChartEndYearTopic data={data} /></div>
            <div className="chart-fullwidth centered"><VerticalBarChartRelevanceByTopic data={data} /></div>
            <div className="chart-fullwidth centered"><HorizontalBarChartRegionOnTopic data={data} /></div>
            <div className="chart-fullwidth centered"><HorizontalBarChartYearTopic data={data} /></div>
          </div>

        </div>
      ) : (
        <div>No records found</div>
      )}
    </div>
  );
}

export default App;
