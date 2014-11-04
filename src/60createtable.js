
yy.ColumnDef = function (params) { return yy.extend(this, params); }
yy.ColumnDef.prototype.toString = function() {
	var s =  this.columnid;
	if(this.dbtypeid) s += ' '+this.dbtypeid;
	if(this.dbsize) {
		s += '('+this.dbsize;
		if(this.dbprecision) s += ','+this.dbprecision;
		s += ')';
	};
	if(this.primarykey) s += ' PRIMARY KEY';
	if(this.notnull) s += ' NOT NULL';
	return s;
}

yy.CreateTable = function (params) { return yy.extend(this, params); }
yy.CreateTable.prototype.toString = function() {
	var s = 'CREATE';
	if(this.temporary) s+=' TEMPORARY';
	s += ' TABLE';
	if(this.ifnotexists) s += ' IF NOT EXISTS';
	s += ' '+this.table.toString();
	if(this.as) s += ' AS '+this.as;
	else { 
		var ss = this.columns.map(function(col){
			return col.toString();
		});
		s += ' ('+ss.join(',')+')';
	}
	return s;
}

// CREATE TABLE
yy.CreateTable.prototype.compile = function (db) {
	var self = this;
//	console.log(this);

	return function() {

		var tableid = self.table.tableid;
		if(!self.ifnotexists || self.ifnotexists && !db.tables[tableid]) {

			if(db.tables[tableid]) 
				throw new Error('Can not create table \''+this.target.value
					+'\', because it already exists in the database \''+db.databaseid+'\'');

			var table = db.tables[tableid] = {}; // TODO Can use special object?
			table.columns = [];
			table.xcolumns = {};
			self.columns.forEach(function(col) {
				var newcol = {
					columnid: col.columnid.toLowerCase(),
					dbtypeid: col.dbtypeid.toUpperCase() // TODO: Add types table
				};
				table.columns.push(newcol);
				table.xcolumns[newcol.columnid] = newcol;
			});

			table.data = [];
			return 1;
		};
		return 0;
	};
};


