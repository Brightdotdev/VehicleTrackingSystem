package com.example.VehicleService.Models;


import com.example.VehicleService.Utils.VehicleEnums;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_wildcard_attributes")
public class VehicleWildcardAttributeModel {



    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName =  "user_id_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_id_sequence"
    )
    private Long id;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    private VehicleModel vehicle;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleEnums.VehicleWildCardType wildcardKey;


    @Column(nullable = false)
    private boolean wildcardValue;

    public VehicleWildcardAttributeModel(
            VehicleModel vehicle, VehicleEnums.VehicleWildCardType wildcardKey, boolean wildcardValue) {


        this.vehicle = vehicle;
        this.wildcardKey = wildcardKey;
        this.wildcardValue = wildcardValue;
    }

    public VehicleWildcardAttributeModel() {
    }



    public VehicleModel getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleModel vehicle) {
        this.vehicle = vehicle;
    }

    public VehicleEnums.VehicleWildCardType getWildcardKey() {
        return wildcardKey;
    }

    public void setWildcardKey(VehicleEnums.VehicleWildCardType wildcardKey) {
        this.wildcardKey = wildcardKey;
    }

    public boolean getWildcardValue() {
        return wildcardValue;
    }

    public void setWildcardValue(boolean wildcardValue) {
        this.wildcardValue = wildcardValue;
    }
}
