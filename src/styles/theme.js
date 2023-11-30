
import './fonts.css'

const size = {
  mobileS: "480px",
  mobileL: "770px",
  tabletS: "1023px",
  tabletL: "1280px",
  laptop: "1460px",
  desktop: "1700px",
}

const theme = {
  color: {
    first: "#8e44ad",
    secondary: "#9b59b6",
    third: "#cd84f1",
    strong: "#1a1a1a",
    light: "#ababab",
    background0: "#FFD80A",
    background1: "#FFD80A",
    background2: "#3250D2",
    background3: "#F4F4F4",
    background3: "#F0F0F0",
    font1: "#2E2D2D",
    font2: "#343841",
    font3: "#9A9A9A",
    font4: "#E7E7E7",
    font4_5: "#D6D9DC",
    font5: "#B2B2B2",
    font6: "#ddd",
    font7: "#f5f5f5",
    red: "#E61515",
    blue: "#3250D2",
    cardColor: [
      { font: '#fff', background: '#024643' },
      { font: '#fff', background: '#31125A' },
      { font: '#fff', background: '#4A02CC' },
      { font: '#000', background: '#f5f6f8' },
    ],
    manager: {
      background1: "#3250D2",
      background2: "#eef1fd",
      background3: "#f5f6f8",
      font1: "#495057",
      font2: "#596275",
      font3: "#7b8190",
    }
  },
  size: {
    font2: '27px',
    font2_5: '25px',
    font3: '22px',
    font3_5: '20px',
    font4: '17px',
    font5: '14px',
    font6: '12px',
    font7: '9px',
    font8: '8px',
    font9: '6px',
    mobileS: `(max-width: ${size.mobileS})`,
    mobileL: `(max-width: ${size.mobileL})`,
    tabletS: `(max-width: ${size.tabletS})`,
    tabletL: `(max-width: ${size.tabletL})`,
    laptop: `(max-width: ${size.laptop})`,
    desktop: `(max-width: ${size.desktop})`,
  },
  font: {
    normal: "SpoqaHanSansRegular",
    bold: "SpoqaHanSansBold",
    ultra_light: "SpoqaHanSansThin",
    light: "SpoqaHanSansLight",
  },
  boxShadow: "0px 12px 12px #00000029",
  borderRadius: "10px"
}

export default theme