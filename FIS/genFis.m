%%
clear
clc

load TrainingSet.dat;

opt=genfisOptions("GridPartition");

opt.NumMembershipFunctions = [4 4 4 4];

fis=genfis(TrainingSet(:,1:4),TrainingSet(:,5),opt)

writefis(fis,"GaussianMF");
%%
load TrainingSet.dat;

fis=readfis("GeneratedFis.fis");