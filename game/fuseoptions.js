
//need to create fusion options and a handler to pick an adequate option.  Maybe happens in fuse code?


//vector of atoms:
//z is z-number
//nm is minimum neutrons allowed
//nx is maximum neutrons allowed
//me[] is an array of mass excesses by n-number offset by nm 
//hl[] is an array of half-life times and decay types by n-number (null if stable)
//to-do: add more variables: name, symbol, beta decay energy, neutron binding energy, ...
let atoms = [];
atoms.push({z:0, nm:1, nx:1, me:[8071],hl:[1613]});
atoms.push({z:1, nm:0, nx:3, me:[7288,13135,14949,24620],hl:[null,null,[3.9e8,"n"],[4,"n"]]});
atoms.push({z:2, nm:1, nx:6, me:[14931,2424,11231,17592,26073,31609],hl:[null,null,[1e-6,"n"],[.8,"b"],[1e-6,"n"],[.12,"b"]]});


//nuke weight excess (KeV)
// 0,1,8071
// 1,0,7288
// 1,1,13135
// 1,2,14949
// 1,3,24620
// 1,4,32890
// 1,5,41900
// 1,6,49100
// 2,1,14931
// 2,2,2424
// 2,3,11231
// 2,4,17592
// 2,5,26073
// 2,6,31609
// 2,6,31609
// 2,7,40940
// 2,8,49200
// 3,0,28700
// 3,1,25320
// 3,2,11680
// 3,3,14086
// 3,4,14907
// 3,5,20945
// 3,6,24954
// 3,7,33053
// 3,8,40728
// 3,9,49010
// 3,10,56980
