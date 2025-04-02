import { Github, Linkedin } from "lucide-react"
export default function teammate(props){
    return(
        <div className="teammate-card">
            <div className="teammate-identity" >
            <div className="teammate-name mb-2">{props.fullname}</div>
            <div className="teammate-title">{props.role}</div>
            </div>
         
            <div className="teammate-role">
            {props.desc}
            </div>
            <div className="teammate-social">
                <a href={props.github | "#"}><Github /></a>
                <a href={props.linkedin | "#"}><Linkedin /></a>
                
            </div>
        </div>
    )
}