import Menu from "../components/ui/Menu"
import ParentsMain from "../components/ParentsMain"
import ParentsSide from "../components/ParentsSide"
import "../css/dashboard.css"
export default function ParentsDashboard() {
  return (
    <div className="dashboard">
    <Menu />
    <ParentsMain />
    <ParentsSide />
    </div>
  )
}
