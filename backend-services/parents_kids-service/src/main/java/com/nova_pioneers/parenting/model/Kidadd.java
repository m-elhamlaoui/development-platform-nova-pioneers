package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "kids")
public class Kidadd{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
   
    private Long kid_id;


    private Long user_id;

    private Long parent_id;

    private LocalDate birth_date;

    private Integer totalXp = 0;

    private Integer isRestricted = 1;

   
    public Long getKidId() {
        return kid_id;
    }

    
    public void setKidId(Long kid_id) {
        this.kid_id = kid_id;
    }

    
    public Long getUser_id() {
        return user_id;
    }

    
    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    
    public Long getParent_id() {
        return parent_id;
    }

   
    public void setParent_id(Long parent_id) {
        this.parent_id = parent_id;
    }

    
    public LocalDate getBirth_date() {
        return birth_date;
    }

   
    public void setBirth_date(LocalDate birth_date) {
        this.birth_date = birth_date;
    }

    
    public Integer getTotalXp() {
        return totalXp;
    }

    
    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
    }

    
    public Integer getIsRestricted() {
        return isRestricted;
    }

    
    public void setIsRestricted(Integer isRestricted) {
        this.isRestricted = isRestricted;
    }

}
