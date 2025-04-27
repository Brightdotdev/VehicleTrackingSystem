package com.example.AuthService.Utils;

public class UtilRecords {


    public record Task (String createdBy, String  title ,String description ) {

        @Override
        public String createdBy() {
            return createdBy;
        }

        @Override
        public String title() {
            return title;
        }

        @Override
        public String description() {
            return description;
        }
    }

    public record TaskStatusUpdate(String createdBy, String title, UtilRecords.TaskStatus status){
        @Override
        public String createdBy() {
            return createdBy;
        }

        @Override
        public UtilRecords.TaskStatus status() {
            return status;
        }

        @Override
        public String title() {
            return title;
        }
    }



   public static enum TaskStatus{
       ONGOING,
       DONE,
       NOT_STARTED

   }



}
