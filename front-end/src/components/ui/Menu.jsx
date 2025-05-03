import dashlogo from "../../assets/np-logo.png"
import { Link } from "react-router-dom";
import {House, BookMarked, Baby, Heart, Settings, LogOut} from "lucide-react"

export default function Menu() {
  return (
    <div className="Menu flex flex-col space-evenly shadow" style={{minHeight: "100vh", justifyContent:"space-between"}}>
      <div className="menu-upper-section">
        <img className="dash-logo w-[60px]" src={dashlogo} alt="" />
        <div className="menu-links-container">
            <h1>Overview</h1>
            <div className="menu-links flex flex-col gap-[5px]">
              <Link className="menu-link flex justify-start items-end gap-[5px] min-h-content active"> <House className="inline w-[20px]" /> <p>Dashboard</p></Link>
              <Link className="menu-link flex justify-start items-end gap-[5px] min-h-content"> <BookMarked className="inline w-[20px]" /> <p>Lessons</p></Link>
              <Link className="menu-link flex justify-start items-end gap-[5px] min-h-content"> <Baby className="inline w-[20px]" /> <p>My kids</p></Link>
              <Link className="menu-link flex justify-start items-end gap-[5px] min-h-content"> <Heart className="inline w-[20px]" /> <p>Favorites</p></Link>

            </div>
        </div>
        <div className="children-container flex flex-col">
            <h1 className="">Children</h1>
            <div className="children-list-container flex flex-col">
                <Link className="child-link block flex justify-center items-center">
                    <img className="dash-logo w-[45px] block  m-[7px]" src={dashlogo} alt="" />
                    <div className="child-infos">
                      <div className="name">Zakaria OUMGHAR</div>
                      <div className="child-xp">94830 XP</div>
                    </div>
                </Link>
                <Link className="child-link block flex justify-center items-center">
                    <img className="dash-logo w-[45px] block" src={dashlogo} alt="" />
                    <div className="child-infos">
                      <div className="name">Zakaria OUMGHAR</div>
                      <div className="child-xp">94830 XP</div>
                    </div>
                </Link>
            </div>
        </div>
      
      </div>
      <div className="menu-lower-section">
        <div className="menu-settings">
          <h1>Settings</h1>
          <div className=" flex flex-col gap-[7px]">
          <Link className="flex justify-start items-end gap-[5px] min-h-content settings"> <Settings className="inline w-[20px]" /> <p>Settings</p></Link>
          <Link className="flex justify-start items-end gap-[5px] min-h-content logout"> <LogOut className="inline w-[20px]" /> <p>Log out</p></Link>
            </div>
        </div>
      </div>
    </div>
  )
}
