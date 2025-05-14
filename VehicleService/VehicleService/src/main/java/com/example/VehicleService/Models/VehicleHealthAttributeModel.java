package com.example.VehicleService.Models;


import com.example.VehicleService.Utils.VehicleEnums;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_health_attributes")
public class VehicleHealthAttributeModel {

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
    private VehicleEnums.VehicleHealthAttributeType attributeName;


    @Column(nullable = false)
    private double score;

    public VehicleHealthAttributeModel() {
    }

    public VehicleHealthAttributeModel( VehicleModel vehicle, VehicleEnums.VehicleHealthAttributeType attributeName, double score) {
        this.vehicle = vehicle;
        this.attributeName = attributeName;
        this.score = score;
    }



    public VehicleModel getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleModel vehicle) {
        this.vehicle = vehicle;
    }

    public VehicleEnums.VehicleHealthAttributeType getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(VehicleEnums.VehicleHealthAttributeType attributeName) {
        this.attributeName = attributeName;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
