%%
clear
clc

%Number of membership function for each input variable
numberMembershipFunction=[4 4 4 4];

%Type of membership function for each input
inputMembershipFunctionType=["gbellmf" "gbellmf" "gbellmf" "gbellmf"];

%Specify the type of membership function used for output
outputMembershipFunctionType="constant";

%Load the dataset used for generating FIS
load TrainingSet.dat;

%Specify the technique used for generating FIS
opt=genfisOptions("GridPartition");

opt.NumMembershipFunctions = numberMembershipFunction;

opt.InputMembershipFunctionType=inputMembershipFunctionType;

opt.OutputMembershipFunctionType=outputMembershipFunctionType;

fis=genfis(TrainingSet(:,1:4),TrainingSet(:,5),opt);

%Store the FIS generated in a file
writefis(fis,"GBellMF");
%%